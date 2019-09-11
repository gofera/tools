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

func processAgenda(doc *Doc) {
	if doc.Agenda {
		agenda := createAgenda(doc)
		updateAgenda(doc, agenda)
	}
}

func createAgenda(doc *Doc) Agenda {
	agenda := Agenda{}
	for _, s := range doc.Sections {
		if doc.Agenda && s.Elem == nil && s.Title != "" {
			agenda.Lines = append(agenda.Lines, AgendaLine{
				Page:  s.Number[0],
				Title: s.Title,
			})
		}
	}
	return agenda
}

func updateAgenda(doc *Doc, agenda Agenda) {
	for i, s := range doc.Sections {
		if doc.Agenda && s.Elem == nil && s.Title != "" {
			doc.Sections[i].Elem = append(doc.Sections[i].Elem, agenda.With(i))
			doc.Sections[i].Title = "Agenda"
		}
	}
}
