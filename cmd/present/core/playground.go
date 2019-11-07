package present_core

import (
	"bytes"
	"golang.org/x/tools/present"
	"io/ioutil"
	"net/http"
	"net/url"
	"path/filepath"
	"strings"
)

func InitPresentPlayground() {
	http.HandleFunc("/playground/run", playgroundRunHandler)
	http.HandleFunc("/playground/", playgroundPageHandler)
}

func playgroundPageHandler(writer http.ResponseWriter, request *http.Request) {
	path := request.URL.Path
	index := strings.Index(path, "/playground")
	suffix := path[index+len("/playground"):]
	if strings.HasPrefix(suffix, "/") {
		suffix = suffix[1:]
	}
	if suffix == "" {
		http.ServeFile(writer, request, filepath.Join(*basePath, "static/playground/index.html"))
	} else {
		http.ServeFile(writer, request, filepath.Join(*basePath, "static/playground/"+suffix))
	}
}

func playgroundRunHandler(writer http.ResponseWriter, request *http.Request) {
	u := findPath(request.URL)
	if u == nil {
		referer := request.Header.Get("Referer")
		if referer != "" {
			origin, err := url.Parse(referer)
			if err != nil {
				http.Error(writer, "Bad Referer: "+err.Error(), http.StatusBadRequest)
				return
			}
			builtin, _ := url.Parse("resources")
			u = origin.ResolveReference(builtin)
		} else {
			http.Error(writer, "The parameter 'path' must be correctly provided", http.StatusBadRequest)
			return
		}
	}

	content, err := ioutil.ReadAll(request.Body)
	if err != nil {
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		return
	}
	ctx := present.Context{ReadFile: func(path string) (i []byte, e error) {
		path = filepath.ToSlash(path)
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
		http.Error(writer, err.Error(), http.StatusBadRequest)
		return
	}
	tmpl := contentTemplate[".slide"]

	err = doc.Render(writer, tmpl)
	if err != nil {
		http.Error(writer, err.Error(), http.StatusBadRequest)
	}
	return
}
