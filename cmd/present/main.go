// Copyright 2013 The Go Authors.  All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"flag"
	"fmt"
	"github.com/sqweek/dialog"
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
	basePath      = flag.String("base", "", "base path for slide template and static resources")
	contentPath   = flag.String("content", ".", "base path for presentation content")
	usePlayground = flag.Bool("use_playground", false, "run code snippets using play.golang.org; if false, run them locally and deliver results by WebSocket transport")
	nativeClient  = flag.Bool("nacl", false, "use Native Client environment playground (prevents non-Go code execution) when using local WebSocket transport")
	urlPrefix     = flag.String("urlprefix", "", "url prefix, if show in https://tramweb/ppt, the value should be ppt")
	logPath       = flag.String("log", "", "log path, default: stderr")
	preview       = flag.Bool("preview", false, "a preview tray tool will run")
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

func main() {
	flag.BoolVar(&present.PlayEnabled, "play", true, "enable playground (permit execution of arbitrary user code)")
	flag.BoolVar(&present.NotesEnabled, "notes", true, "enable presenter notes (press 'N' from the browser to display them)")
	flag.Parse()

	closeLogFile, err := initLog()
	if err != nil {
		log.Fatalf("fail to init log %s, reason: %s", *logPath, err)
	}
	if closeLogFile != nil {
		defer closeLogFile()
	}

	if len(*urlPrefix) > 0 && (*urlPrefix)[0] != '/' {
		*urlPrefix = "/" + *urlPrefix
	}
	present.UrlPrefix = *urlPrefix
	InitOnline()
	if os.Getenv("GAE_ENV") == "standard" {
		log.Print("Configuring for App Engine Standard")
		port := os.Getenv("PORT")
		if port == "" {
			port = "8080"
		}
		*httpAddr = fmt.Sprintf("0.0.0.0:%s", port)
		pwd, err := os.Getwd()
		if err != nil {
			log.Fatalf("Couldn't get pwd: %v\n", err)
		}
		*basePath = pwd
		*usePlayground = true
		*contentPath = "./content/"
	}

	if *basePath == "" {
		p, err := build.Default.Import(basePkg, "", build.FindOnly)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Couldn't find gopresent files: %v\n", err)
			fmt.Fprintf(os.Stderr, basePathMessage, basePkg)
			os.Exit(1)
		}
		*basePath = p.Dir
	}

	umlJarPath = filepath.Join(*basePath, "lib/plantuml.jar")

	err = initTemplates(*basePath)
	if err != nil {
		log.Fatalf("Failed to parse templates: %v", err)
	}

	ln, err := net.Listen("tcp", *httpAddr)
	if err != nil {
		if *preview {
			dialog.Message("Fail to Open WebPPT Previewer. It may running now. Error:\n%s", err.Error()).Info()
		}
		log.Fatal(err)
	}
	defer ln.Close()

	_, port, err := net.SplitHostPort(ln.Addr().String())
	if err != nil {
		log.Fatal(err)
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
			log.Fatal(err)
		}
		if reqPort == "0" {
			origin.Host = net.JoinHostPort(reqHost, port)
		} else {
			origin.Host = *httpAddr
		}
	}

	initPlayground(*basePath, origin)
	http.Handle("/static/", http.FileServer(http.Dir(*basePath)))

	if !ln.Addr().(*net.TCPAddr).IP.IsLoopback() &&
		present.PlayEnabled && !*nativeClient && !*usePlayground {
		log.Print(localhostWarning)
	}

	log.Printf("Open your web browser and visit %s", origin.String())
	if present.NotesEnabled {
		log.Println("Notes are enabled, press 'N' from the browser to display them.")
	}
	if *preview {
		go startPreview()
	}
	err = http.Serve(ln, nil)
	if err != nil && *preview {
		dialog.Message("Fail to Open WebPPT Previewer. Error:\n%s", err.Error()).Info()
	}
	log.Fatal(err)
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
