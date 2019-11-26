// Copyright 2013 The Go Authors.  All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package present_core

import (
	"crypto/tls"
	"flag"
	"fmt"
	"go/build"
	"log"
	"net"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"

	"golang.org/x/tools/present"
)

const basePkg = "golang.org/x/tools/cmd/present"

var (
	httpAddr      = flag.String("http", "127.0.0.1:3999", "HTTP service address (e.g., '127.0.0.1:3999')")
	originHost    = flag.String("orighost", "", "host component of web origin URL (e.g., 'localhost')")
	BasePath      = flag.String("base", "", "base path for slide template and static resources")
	contentPath   = flag.String("content", ".", "base path for presentation content")
	usePlayground = flag.Bool("use_playground", false, "run code snippets using play.golang.org; if false, run them locally and deliver results by WebSocket transport")
	nativeClient  = flag.Bool("nacl", false, "use Native Client environment playground (prevents non-Go code execution) when using local WebSocket transport")
	urlPrefix     = flag.String("urlprefix", "", "url prefix, if show in https://tramweb/ppt, the value should be ppt")
	logPath       = flag.String("log", "", "log path, default: stderr")
)

func initLog() (closer func() error, err error) {
	log.SetFlags(log.LstdFlags | log.Lshortfile)
	if *logPath == "" {
		return
	}
	w, err := os.OpenFile(*logPath, os.O_RDWR|os.O_CREATE|os.O_APPEND, 0644)
	if err != nil {
		return
	}
	log.SetOutput(w)
	closer = w.Close
	return
}

func Start() (run func() error, err error) {
	http.DefaultClient.Transport = &http.Transport{
		TLSClientConfig: &tls.Config{
			InsecureSkipVerify: true,
		},
	}

	deferWork := make([]func(), 0)
	defer func() {
		if err != nil {
			for _, w := range deferWork {
				w()
			}
		}
	}()

	flag.BoolVar(&present.PlayEnabled, "play", true, "enable playground (permit execution of arbitrary user code)")
	flag.BoolVar(&present.NotesEnabled, "notes", true, "enable presenter notes (press 'N' from the browser to display them)")
	flag.StringVar(&present.BitBucketUrl, "bitbucket", "https://git-brion-us.asml.com:8443", "Bit bucket URL")
	flag.Parse()

	present.BitBucketUrl = strings.TrimRight(present.BitBucketUrl, "/")

	closeLogFile, err := initLog()
	if err != nil {
		return nil, fmt.Errorf("fail to init log %s, reason: %s", *logPath, err)
	}
	if closeLogFile != nil {
		deferWork = append(deferWork, func() {
			_ = closeLogFile()
		})
	}

	if len(*urlPrefix) > 0 && (*urlPrefix)[0] != '/' {
		*urlPrefix = "/" + *urlPrefix
	}
	present.UrlPrefix = *urlPrefix
	if os.Getenv("GAE_ENV") == "standard" {
		log.Print("Configuring for App Engine Standard")
		port := os.Getenv("PORT")
		if port == "" {
			port = "8080"
		}
		*httpAddr = fmt.Sprintf("0.0.0.0:%s", port)
		pwd, err := os.Getwd()
		if err != nil {
			return nil, fmt.Errorf("Couldn't get pwd: %v\n", err)
		}
		*BasePath = pwd
		*usePlayground = true
		*contentPath = "./content/"
	}

	if *BasePath == "" {
		p, err := build.Default.Import(basePkg, "", build.FindOnly)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Couldn't find gopresent files: %v\n", err)
			fmt.Fprintf(os.Stderr, basePathMessage, basePkg)
			os.Exit(1)
		}
		*BasePath = p.Dir
	}

	InitOnline()
	InitPresentPlayground()
	umlJarPath = filepath.Join(*BasePath, "lib/plantuml.jar")

	err = initTemplates(*BasePath)
	if err != nil {
		return nil, fmt.Errorf("Failed to parse templates: %v", err)
	}

	ln, err := net.Listen("tcp", *httpAddr)
	if err != nil {
		return nil, err
	}
	deferWork = append(deferWork, func() {
		_ = ln.Close()
	})

	_, port, err := net.SplitHostPort(ln.Addr().String())
	if err != nil {
		return nil, err
	}

	origin := &url.URL{Scheme: "http"}
	if *originHost != "" {
		origin.Host = net.JoinHostPort(*originHost, port)
	} else if ln.Addr().(*net.TCPAddr).IP.IsUnspecified() {
		name, _ := os.Hostname()
		origin.Host = net.JoinHostPort(name, port)
	} else {
		reqHost, reqPort, err := net.SplitHostPort(*httpAddr)
		if err != nil {
			return nil, err
		}
		if reqPort == "0" {
			origin.Host = net.JoinHostPort(reqHost, port)
		} else {
			origin.Host = *httpAddr
		}
	}

	initPlayground(*BasePath, origin)
	abs, err := filepath.Abs(*BasePath)
	if err != nil {
		log.Fatal(err)
	}
	http.Handle("/static/", http.FileServer(http.Dir(abs)))

	if !ln.Addr().(*net.TCPAddr).IP.IsLoopback() &&
		present.PlayEnabled && !*nativeClient && !*usePlayground {
		log.Print(localhostWarning)
	}

	log.Printf("Open your web browser and visit %s", origin.String())
	if present.NotesEnabled {
		log.Println("Notes are enabled, press 'N' from the browser to display them.")
	}
	return func() error {
		defer func() {
			for _, w := range deferWork {
				w()
			}
		}()
		return http.Serve(ln, nil)
	}, nil
}

func environ(vars ...string) []string {
	env := os.Environ()
	for _, r := range vars {
		k := strings.SplitAfter(r, "=")[0]
		var found bool
		for i, v := range env {
			if strings.HasPrefix(v, k) {
				env[i] = r
				found = true
			}
		}
		if !found {
			env = append(env, r)
		}
	}
	return env
}

const basePathMessage = `
By default, gopresent locates the slide template files and associated
static content by looking for a %q package
in your Go workspaces (GOPATH).

You may use the -base flag to specify an alternate location.
`

const localhostWarning = `
WARNING!  WARNING!  WARNING!

The present server appears to be listening on an address that is not localhost
and is configured to run code snippets locally. Anyone with access to this address
and port will have access to this machine as the user running present.

To avoid this message, listen on localhost, run with -play=false, or run with
-play_socket=false.

If you don't understand this message, hit Control-C to terminate this process.

WARNING!  WARNING!  WARNING!
`
