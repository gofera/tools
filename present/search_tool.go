package present

type SearchTool struct {
	Path string
}

func (i SearchTool) TemplateName() string {
	return "search-tool"
}

func parseSearchTool(doc *Doc) (Tool, error) {
	tool := SearchTool{
		Path: UrlPrefix + "/search",
	}
	return tool, nil
}
