package present

import (
	"errors"
	"fmt"
	"html/template"
	"io/ioutil"
	"path/filepath"
	"strings"
)

func init() {
	Register("echarts", parseECharts)
}

type ECharts struct {
	Id            int
	Width, Height int
	Script        template.JS
}

func (i ECharts) TemplateName() string { return "echarts" }

func parseECharts(ctx *Context, fileName string, lineno int, text string) (elem Elem, e error) {
	args := strings.Fields(text)
	if len(args) < 1 {
		return nil, errors.New("Must provide uml file path")
	}

	result := ECharts{Id: lineno, Width: 900, Height: 550}
	a, err := parseArgs(fileName, lineno, args[2:])
	if err != nil {
		return nil, err
	}
	switch len(a) {
	case 0:
		// no size parameters
	case 2:
		if v, ok := a[0].(int); ok {
			result.Height = v
		}
		if v, ok := a[1].(int); ok {
			result.Width = v
		}
	default:
		return nil, fmt.Errorf("incorrect echarts invocation: %q", text)
	}

	file := filepath.ToSlash(filepath.Join(filepath.Dir(fileName), args[1]))
	bytes, err := ioutil.ReadFile(file)
	if err != nil {
		return nil, err
	}
	result.Script = template.JS(fmt.Sprintf(`
function getOption%d() {
%s
    return option;
}
let echarts%d = echarts.init(document.getElementById('echarts%d'));
echarts%d.setOption(getOption%d());
`, lineno, string(bytes), lineno, lineno, lineno, lineno))
	return result, nil
}
