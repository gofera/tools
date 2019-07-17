package present

import (
	"golang.org/x/tools/go/ssa/interp/testdata/src/errors"
	"path/filepath"
	"strings"
)

func init() {
	Register("uml", parseUML)
}

type UML struct {
	File string
}

func (i UML) TemplateName() string { return "uml" }

func parseUML(ctx *Context, fileName string, lineno int, text string) (elem Elem, e error) {
	args := strings.Fields(text)
	if len(args) < 1 {
		return nil, errors.New("Must provide uml file path")
	}
	file := filepath.ToSlash(filepath.Join(filepath.Dir(fileName), args[1]))
	return UML{File: file}, nil
}
