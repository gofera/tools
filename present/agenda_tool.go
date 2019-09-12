package present

type AgendaTool struct {
	Agenda
}

func (i AgendaTool) TemplateName() string {
	return "agenda-tool"
}

func init() {
	RegisterTool(parseAgendaTool)
}

func parseAgendaTool(doc *Doc) (Tool, error) {
	if doc.Agenda {
		tool := AgendaTool{createAgenda(doc)}
		return tool, nil
	}
	return nil, nil
}
