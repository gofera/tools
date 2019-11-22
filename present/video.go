// Copyright 2016 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package present

import (
	"fmt"
	"golang.org/x/tools/go/ssa/interp/testdata/src/errors"
	"strings"
)

func init() {
	Register("video", parseVideo)
}

type Video struct {
	URL        string
	SourceType string
	Width      int
	Height     int
}

func (v Video) TemplateName() string { return "video" }

func parseVideo(ctx *Context, fileName string, lineno int, text string) (Elem, error) {
	args := strings.Fields(text)
	if len(args) < 3 {
		return nil, errors.New("Wrong video usage. Must like `.video <url> <type>`")
	}
	vid := Video{URL: ctx.AbsPath(args[1]), SourceType: args[2]}
	a, err := parseArgs(fileName, lineno, args[3:])
	if err != nil {
		return nil, err
	}
	switch len(a) {
	case 0:
		// no size parameters
	case 2:
		// If a parameter is empty (underscore) or invalid
		// leave the field set to zero. The "video" action
		// template will then omit that vid tag attribute and
		// the browser will calculate the value to preserve
		// the aspect ratio.
		if v, ok := a[0].(int); ok {
			vid.Height = v
		}
		if v, ok := a[1].(int); ok {
			vid.Width = v
		}
	default:
		return nil, fmt.Errorf("incorrect video invocation: %q", text)
	}
	return vid, nil
}
