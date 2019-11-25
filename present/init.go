package present

func init() {
	RegisterTool(parseHomeTool)
	RegisterTool(parseEditTool)
	RegisterTool(parseGitPullTool)
	RegisterTool(parseSearchTool)
	RegisterTool(parsePlaygroundTool)
	RegisterTool(parseHelpTool)
}
