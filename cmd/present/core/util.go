package present_core;

import (
	"html"
	"strings"
)

func escape(s string) string {
	es := html.EscapeString(s)
	return strings.ReplaceAll(es, "\n", "<br>")
}
