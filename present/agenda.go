package present

type Agenda struct {
	Current int
	Lines   []AgendaLine
}

type AgendaLine struct {
	Page  int
	Title string
}

func (i Agenda) TemplateName() string { return "agenda" }

func (i Agenda) With(current int) Agenda {
	i.Current = current
	return i
}

func processAgenda(sections []*Section) {
	agenda := Agenda{}
	for _, s := range sections {
		agenda.Lines = append(agenda.Lines, AgendaLine{
			Page:  s.Number[0],
			Title: s.Title,
		})
	}
	for i, s := range sections {
		s.Elem = append(s.Elem, agenda.With(i))
		s.Title = "Agenda"
	}
}
