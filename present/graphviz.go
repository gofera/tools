package present

import (
	"errors"
	"flag"
	"fmt"
	"html/template"
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
	Style   template.HTMLAttr
}

func (i Graphivz) TemplateName() string { return "graphivz" }

func parseGraphivz(ctx *Context, fileName string, lineno int, text string) (elem Elem, e error) {
	args := strings.Fields(text)
	if len(args) < 1 {
		return nil, errors.New("Must provide Graphivz file path")
	}
	file := filepath.ToSlash(filepath.Join(filepath.Dir(fileName), args[1]))
	bytes, err := ctx.ReadFile(file)
	if err != nil {
		return nil, err
	}

	fs := flag.NewFlagSet("", flag.ExitOnError)
	style := fs.String("style", "", "CSS Style")
	scrollable := fs.Bool("scroll", false, "Show scroll bar")
	err = fs.Parse(args[2:])
	if err != nil {
		return
	}
	if *style != "" {
		*style = fmt.Sprintf(`style="%s"`, *style)
	} else {
		styles := make([]string, 0, 4)
		if *scrollable {
			styles = append(styles, fmt.Sprintf("overflow:scroll"))
		}
		if len(styles) > 0 {
			*style = fmt.Sprintf(`style="%s"`, strings.Join(styles, ";"))
		}
	}

	a, err := parseArgs(fileName, lineno, fs.Args())

	result := Graphivz{
		Content: string(bytes),
		Style: template.HTMLAttr(*style),
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
