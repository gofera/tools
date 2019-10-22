package present

import (
	"bytes"
	"encoding/csv"
	"errors"
	"flag"
	"fmt"
	"html/template"
	"path/filepath"
)

func init() {
	Register("csv", parseTable)
}

type CSV struct {
	Style   template.HTMLAttr
	Headers [][]string
	Records [][]string
}

func (t CSV) TemplateName() string {
	return "csv"
}

func parseTable(ctx *Context, fileName string, lineNumber int, inputLine string) (elem Elem, e error) {
	u := &CSV{}
	args, err := parseArgsWithQuote(inputLine)
	if err != nil {
		return nil, err
	}
	args = args[1:]
	fs := flag.NewFlagSet("", flag.ContinueOnError)
	style := fs.String("style", "", "CSS Style")
	comma := fs.String("comma", ",", "Comma character")
	comment := fs.String("comment", "#", "Comment character")
	header := fs.Int("header", 1, "Header line")
	fs.Usage()
	err = fs.Parse(args)
	if err != nil {
		return nil, err
	}
	if len(fs.Args()) < 1 {
		return nil, errors.New("Table file is not given")
	}
	tableFile := fs.Arg(0)
	file := filepath.ToSlash(filepath.Join(filepath.Dir(fileName), tableFile))
	bs, err := ctx.ReadFile(file)
	if err != nil {
		return nil, err
	}
	csvReader := csv.NewReader(bytes.NewReader(bs))
	switch len(*comma) {
	case 1:
		csvReader.Comma = []rune(*comma)[0]
	case 3:
		csvReader.Comma = []rune(*comma)[1]
	default:
		return nil, errors.New("CSV comma must be one character or wrap by quotes")
	}
	switch len(*comment) {
	case 1:
		csvReader.Comment = []rune(*comment)[0]
	case 3:
		csvReader.Comment = []rune(*comment)[1]
	default:
		return nil, errors.New("CSV comment must be one character or wrap by quotes")
	}
	csvReader.TrimLeadingSpace = true
	records, err := csvReader.ReadAll()
	if err != nil {
		return nil, err
	}
	if *style != "" {
		u.Style = template.HTMLAttr(fmt.Sprintf(`style="%s"`, *style))
	}
	if *header < 0 || *header > len(records) {
		return nil, errors.New("Header setting is wrong")
	}
	u.Headers = records[:*header]
	u.Records = records[*header:]
	return u, nil
}
