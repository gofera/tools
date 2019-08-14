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
	Content []byte
}

func (i UML) TemplateName() string { return "uml" }

func parseUML(ctx *Context, fileName string, lineno int, text string) (elem Elem, e error) {
	args := strings.Fields(text)
	if len(args) < 1 {
		return nil, errors.New("Must provide uml file path")
	}
	file := filepath.ToSlash(filepath.Join(filepath.Dir(fileName), args[1]))
	bytes, err := ctx.ReadFile(file)
	if err != nil {
		return nil, err
	}
	return UML{Content: bytes}, nil
}
