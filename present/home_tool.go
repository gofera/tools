package present

import (
	"strings"
)

type HomeTool struct {
	Path string
}

func (i HomeTool) TemplateName() string {
	return "home-tool"
}

func init() {
	RegisterTool(parseHomeTool)
}

func parseHomeTool(doc *Doc) (Tool, error) {
	i := strings.LastIndex(doc.Path, "/")
	if i <= 0 {
		return nil, nil
	}
	tool := HomeTool{
		Path: UrlPrefix + "/" + doc.Path[:i],
	}
	return tool, nil
}