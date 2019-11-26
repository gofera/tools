package present

type PlaygroundTool struct {
	Path string
}

func (i PlaygroundTool) TemplateName() string {
	return "playground-tool"
}

func parsePlaygroundTool(doc *Doc) (Tool, error) {
	tool := PlaygroundTool{
		Path: UrlPrefix + "/playground/",
	}
	return tool, nil
}
