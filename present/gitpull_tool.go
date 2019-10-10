package present

import (
	"strings"
)

type GitPullTool struct {

}

func (i GitPullTool) TemplateName() string {
	return "gitpull-tool"
}

func init() {
	RegisterTool(parseGitPullTool)
}

func parseGitPullTool(doc *Doc) (Tool, error) {
	// fmt.Println("doc.path:", doc.Path)
	// local path is not started from "users/" prefix
	if !strings.HasPrefix(doc.Path, "users/") {
		return nil, nil
	}
	tool := GitPullTool{}
	return tool, nil
}
