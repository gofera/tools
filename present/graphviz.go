package present

import (
	"errors"
	"path/filepath"
	"strings"
)

func init() {
	Register("uml", parseGraphivz)
}

type Graphviz struct {
	File string
}

func (i Graphviz) TemplateName() string { return "graphviz" }

func parseGraphivz(ctx *Context, fileName string, lineno int, text string) (elem Elem, e error) {
	args := strings.Fields(text)
	if len(args) < 1 {
		return nil, errors.New("Must provide Graphivz file path")
	}
	file := filepath.ToSlash(filepath.Join(filepath.Dir(fileName), args[1]))
	return Graphviz{File: file}, nil
}
