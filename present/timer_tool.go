package present

type TimerTool struct {
	TimeoutSecond float64
}

func (i TimerTool) TemplateName() string {
	return "timer-tool"
}

func parseTimerTool(doc *Doc) (Tool, error) {
	if doc.Timeout == nil {
		return nil, nil
	}
	tool := TimerTool{
		TimeoutSecond: doc.Timeout.Seconds(),
	}
	return tool, nil
}
