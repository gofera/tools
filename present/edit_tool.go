package present

type EditTool struct {
	Path string
}

func (i EditTool) TemplateName() string {
	return "edit-tool"
}

func init() {
	RegisterTool(parseEditTool)
}

func parseEditTool(doc *Doc) (Tool, error) {
	if !doc.IsBitBucketUserPath() {
		return nil, nil
	}
	tool := EditTool{
		Path: BitBucketUrl + "/" + doc.Path,
	}
	return tool, nil
}