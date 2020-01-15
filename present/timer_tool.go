package present

type TimerTool struct {

}

func (i TimerTool) TemplateName() string {
	return "timer-tool"
}

func parseTimerTool(doc *Doc) (Tool, error) {
	if !doc.ShowTimer {
		return nil, nil
	}
	tool := TimerTool{}
	return tool, nil
}
