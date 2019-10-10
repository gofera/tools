package present

type GitPullTool struct {

}

func (i GitPullTool) TemplateName() string {
	return "gitpull-tool"
}

func init() {
	RegisterTool(parseGitPullTool)
}

func parseGitPullTool(doc *Doc) (Tool, error) {
	tool := GitPullTool{}
	return tool, nil
}
