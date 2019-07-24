package present

import (
	"errors"
	"fmt"
	"io/ioutil"
	"path/filepath"
	"strings"
)

func init() {
	Register("graph", parseGraphivz)
}

type Graphivz struct {
	Content string
	Width   int
	Height  int
}

func (i Graphivz) TemplateName() string { return "graphivz" }

func parseGraphivz(ctx *Context, fileName string, lineno int, text string) (elem Elem, e error) {
	args := strings.Fields(text)
	if len(args) < 1 {
		return nil, errors.New("Must provide Graphivz file path")
	}
	file := filepath.ToSlash(filepath.Join(filepath.Dir(fileName), args[1]))
	bytes, err := ioutil.ReadFile(file)
	if err != nil {
		return nil, err
	}

	a, err := parseArgs(fileName, lineno, args[2:])

	result := Graphivz{
		Content: string(bytes),
	}

	switch len(a) {
	case 0:
		// no size parameters
	case 2:
		// If a parameter is empty (underscore) or invalid
		// leave the field set to zero. The "image" action
		// template will then omit that img tag attribute and
		// the browser will calculate the value to preserve
		// the aspect ratio.
		if v, ok := a[0].(int); ok {
			result.Height = v
		}
		if v, ok := a[1].(int); ok {
			result.Width = v
		}
	default:
		return nil, fmt.Errorf("incorrect image invocation: %q", text)
	}
	return result, nil
}
