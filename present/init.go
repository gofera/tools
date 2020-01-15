package present

func init() {
	RegisterTool(parseTimerTool)
	RegisterTool(parseHomeTool)
	RegisterTool(parseEditTool)
	RegisterTool(parseGitPullTool)
	RegisterTool(parseSearchTool)
	RegisterTool(parsePlaygroundTool)
	RegisterTool(parseHelpTool)
}
