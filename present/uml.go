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
	Register("uml", parseUML)
}

type UML struct {
	Content []byte
	Style   template.HTMLAttr
}

func (u UML) TemplateName() string { return "uml" }

func (u *UML) parse(ctx *Context, slideFilePath string, args []string) error {
	fs := flag.NewFlagSet("", flag.ExitOnError)
	style := fs.String("style", "", "CSS Style")
	width := fs.Int("width", 0, "Width (unit: px)")
	height := fs.Int("height", 0, "Height (unit: px)")
	scrollable := fs.Bool("scroll", false, "Show scroll bar")

	err := fs.Parse(args)
	if err != nil {
		return err
	}
	if len(fs.Args()) < 1 {
		return errors.New("must provide uml file path")
	}
	umlFile := fs.Arg(0)
	if *style != "" {
		*style = fmt.Sprintf(`style="%s"`, *style)
	} else {
		styles := make([]string, 0, 4)
		if *width != 0 {
			styles = append(styles, fmt.Sprintf("width:%dpx", *width))
		}
		if *height != 0 {
			styles = append(styles, fmt.Sprintf("height:%dpx", *height))
		}
		if *scrollable {
			styles = append(styles, fmt.Sprintf("overflow:scroll"))
		}
		if len(styles) > 0 {
			*style = fmt.Sprintf(`style="%s"`, strings.Join(styles, ";"))
		}
	}
	file := filepath.ToSlash(filepath.Join(filepath.Dir(slideFilePath), umlFile))
	bytes, err := ctx.ReadFile(file)
	if err != nil {
		return err
	}
	u.Content = bytes
	u.Style = template.HTMLAttr(*style)
	return nil
}

func parseUML(ctx *Context, fileName string, lineno int, text string) (elem Elem, e error) {
	args := strings.Fields(text)[1:] // a[0] is ".uml", so skip it
	uml := UML{}
	e = uml.parse(ctx, fileName, args)
	if e == nil {
		elem = uml
	}
	return
}
