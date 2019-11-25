package present

type HelpTool struct {
	Path string
}

func (i HelpTool) TemplateName() string {
	return "help-tool"
}

func parseHelpTool(doc *Doc) (Tool, error) {
	tool := HelpTool{
		Path: UrlPrefix + "/users/weliu/repos/share_webppt/browse/main.slide",
	}
	return tool, nil
}
