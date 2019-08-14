package main

import (
	"bytes"
	"fmt"
	"golang.org/x/tools/present"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
)

func init() {
	http.HandleFunc("/slide/online/", onlineHandler)
}

func onlineHandler(w http.ResponseWriter, request *http.Request) {
	paths := request.URL.Query()["path"]
	if len(paths) != 1 {
		_, _ = w.Write([]byte("The parameter 'path' must be provided"))
		return
	}
	path := paths[0]
	u, err := url.Parse(path)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if u.Scheme == "" {
		u.Scheme = "http"
	}
	content, err := getContent(u)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	err = onlineRenderDoc(w, u, content)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	return
}

func onlineRenderDoc(w io.Writer, u *url.URL, content []byte) error {
	fmt.Println(u.Path, u.User, u.ForceQuery, u.Fragment, u.Host, u.Opaque, u.RawPath, u.Scheme)
	ctx := present.Context{ReadFile: func(path string) (i []byte, e error) {
		nu := url.URL{
			Path:       path,
			Scheme:     u.Scheme,
			Host:       u.Host,
			RawQuery:   u.RawQuery,
			ForceQuery: u.ForceQuery,
			Opaque:     u.Opaque,
			User:       u.User,
			Fragment:   u.Fragment,
		}
		return getContent(&nu)
	}}
	doc, err := ctx.Parse(bytes.NewReader(content), u.Path, 0)
	if err != nil {
		return err
	}
	tmpl := contentTemplate[".slide"]

	return doc.Render(w, tmpl)
}

func getContent(u *url.URL) ([]byte, error) {
	resp, err := http.Get(u.String())
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	return body, nil
}
