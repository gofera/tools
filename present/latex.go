package present

import (
	"bufio"
	"bytes"
	"fmt"
	"golang.org/x/tools/go/ssa/interp/testdata/src/errors"
	"io"
	"path/filepath"
	"strings"
)

func init() {
	Register("latex", parseLatex)
}

type Latex struct {
	Content string
}

func (i Latex) TemplateName() string { return "latex" }

func parseLatex(ctx *Context, fileName string, lineno int, text string) (elem Elem, e error) {
	args := strings.Fields(text)
	if len(args) < 2 {
		return nil, errors.New("Incorrect args count")
	}
	file := args[1]
	bs, err := ctx.ReadFile(filepath.ToSlash(filepath.Join(filepath.Dir(fileName), file)))
	if err != nil {
		return nil, err
	}
	if len(args) == 1 {
		return Latex{Content: string(bs)}, nil
	} else {
		part := args[2]
		if len(part) == 0 {
			return nil, fmt.Errorf("Latex part can't be empty")
		}
		reader := bytes.NewReader(bs)
		bufReader := bufio.NewReader(reader)
		var found, end, eof bool
		var content strings.Builder
		for !end && !eof {
			var line string
			for {
				lineBytes := make([]byte, 0)
				linePart, isPrefix, err := bufReader.ReadLine()
				if err == io.EOF {
					eof = true
				} else if err != nil {
					return nil, err
				}
				lineBytes = append(lineBytes, linePart...)
				if !isPrefix {
					line = string(lineBytes)
					break
				}
			}
			switch {
			case strings.TrimSpace(line) == "$$"+part:
				if found {
					return nil, fmt.Errorf("Latex part defined twice: %s", part)
				} else {
					found = true
				}
			case strings.TrimSpace(line) == "$$":
				if found {
					end = true
				}
			default:
				if found {
					content.WriteString(line)
					content.WriteRune('\n')
				}
			}
		}
		if !end {
			return nil, fmt.Errorf("Latex part not closed: %s", part)
		}
		return Latex{Content: content.String()}, nil
	}
}
