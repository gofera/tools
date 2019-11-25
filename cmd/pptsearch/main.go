package main

import (
	"flag"
	"log"
	"net/http"
	"os"
)

var(
	port        = flag.String("port", "3997", "port of web ppt search")
	contentPath = flag.String("content", ".", "base path for presentation content")
	logPath     = flag.String("log", "", "log path, default: stderr")
	static      = flag.String("static", "", "front static resources")
	webPptUrl   = flag.String("url", "https://tramweb.asml.com/ppt", "web ppt url root")
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
	flag.Parse()

	closeLogFile, err := initLog()
	if err != nil {
		panic(err)
	}
	if closeLogFile != nil {
		defer closeLogFile()
	}

	if *static != "" {
		http.Handle("/", http.FileServer(http.Dir(*static)))
	}
	http.HandleFunc("/api/search", searchHandler)
	http.HandleFunc("/api/webppturl", getWebPptUrl)

	http.ListenAndServe(":" + *port, nil)
}

func getWebPptUrl(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte(*webPptUrl))
}
