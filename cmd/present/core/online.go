package present_core

import (
	"bytes"
	"fmt"
	"golang.org/x/tools/present"
	"io"
	"io/ioutil"
	"net/http"
	"net/url"
	"path"
	"path/filepath"
)

var onlinePrefix = "/online/"

func InitOnline() {
	http.HandleFunc(onlinePrefix, onlineHandler)
}

func onlineHandler(writer http.ResponseWriter, request *http.Request) {
	u := findPath(request.URL)
	if u == nil {
		referer := request.Header.Get("Referer")
		if referer != "" {
			onlineResource(writer, request, referer)
		} else {
			http.Error(writer, "The parameter 'path' must be correctly provided", http.StatusBadRequest)
			return
		}
	} else {
		onlineRender(writer, request, u)
	}
}

func onlineRender(writer http.ResponseWriter, request *http.Request, onlinePath *url.URL) {
	content, err := getContent(onlinePath)
	if err != nil {
		http.Error(writer, err.Error(), http.StatusNotFound)
		return
	}
	err = onlineRenderDoc(writer, onlinePath, content)
	if err != nil {
		http.Error(writer, err.Error(), http.StatusInternalServerError)
	}
	return
}

func onlineResource(writer http.ResponseWriter, request *http.Request, refer string) {
	origin, err := url.Parse(refer)
	if err != nil {
		http.Error(writer, "Bad Referer: "+err.Error(), http.StatusBadRequest)
		return
	}
	u := findPath(origin)
	if u == nil {
		http.Error(writer, "Bad Referer: The parameter 'path' must be correctly provided", http.StatusBadRequest)
		return
	}
	u.Path = path.Join(path.Dir(u.Path), request.URL.Path[len(onlinePrefix):])
	if u.Scheme == "file" {
		http.ServeFile(writer, request, u.String()[len("file://"):])
	} else {
		http.Redirect(writer, request, u.String(), http.StatusMovedPermanently)
	}
}

func findPath(u *url.URL) *url.URL {
	path := u.Query().Get("path")
	if path == "" {
		return nil
	}
	u, err := url.Parse(path)
	if err != nil {
		return nil
	}
	if u.Scheme == "" {
		u.Scheme = "http"
	}
	return u
}

func onlineRenderDoc(w io.Writer, u *url.URL, content []byte) error {
	ctx := present.Context{
		ReadFile: func(path string) (i []byte, e error) {
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
		},
		AbsPath: func(filename string) string {
			return filename
		},
	}
	doc, err := ctx.Parse(bytes.NewReader(content), u.Path, 0)
	if err != nil {
		return err
	}
	tmpl := contentTemplate[".slide"]

	return doc.Render(w, tmpl)
}

func getContent(u *url.URL) ([]byte, error) {
	switch u.Scheme {
	case "http", "https":
		resp, err := http.Get(u.String())
		if err != nil {
			return nil, err
		}
		defer resp.Body.Close()
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			return nil, err
		}
		if resp.StatusCode >= 300 {
			return nil, fmt.Errorf("Resource not found (%s): %s", u.String(), body)
		}
		return body, nil
	case "file":
		return ioutil.ReadFile(u.String()[len("file://"):])
	default:
		return nil, fmt.Errorf("Unknown scheme: %s", u.Scheme)
	}
}
