package present

type GitPullTool struct {

}

func (i GitPullTool) TemplateName() string {
	return "gitpull-tool"
}

func parseGitPullTool(doc *Doc) (Tool, error) {
	// fmt.Println("doc.path:", doc.Path)
	if !doc.IsBitBucketUserPath() {
		return nil, nil
	}
	tool := GitPullTool{}
	return tool, nil
}
