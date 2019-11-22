package present_core

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
)

func init() {
	http.HandleFunc("/api/search", searchHandler)
}

func searchHandler(writer http.ResponseWriter, request *http.Request) {
	keyword := request.URL.Query().Get("keyword")
	if keyword == "" {
		http.Error(writer, "keyword must provide", http.StatusBadRequest)
		return
	}
	cmd := exec.Command("grep", "-rine", keyword, *contentPath, "--exclude-dir=.git", "--include=*.slide")
	cmd.Stderr = os.Stderr
	output, err := cmd.Output()
	if err != nil {
		if exitError, ok := err.(*exec.ExitError); ok && exitError.ExitCode() == 1 {
			writer.WriteHeader(http.StatusOK)
			_, _ = writer.Write([]byte("[]"))
		} else {
			http.Error(writer, "Fail to do search: "+err.Error(), http.StatusInternalServerError)
		}
		return
	}
	lines := strings.Split(string(output), "\n")
	resultMap := make(map[string]*SearchRecord)
	result := make([]*SearchRecord, 0)
	for _, line := range lines {
		fmt.Println(line)
		s1 := strings.SplitN(line, ".slide:", 2)
		if len(s1) != 2 {
			continue
		}
		s2 := strings.SplitN(s1[1], ":", 2)
		path := s1[0] + ".slide"
		line, err := strconv.Atoi(s2[0])
		if err != nil {
			http.Error(writer, "Fail to extract search result line: "+err.Error(), http.StatusInternalServerError)
			return
		}
		text := s2[1]
		if record, ok := resultMap[path]; ok {
			record.Lines = append(record.Lines, SearchLine{
				Line: line,
				Text: text,
			})
		} else {
			relative, err := filepath.Rel(*contentPath, path)
			if err != nil {
				http.Error(writer, "Fail to calc url: "+err.Error(), http.StatusInternalServerError)
				return
			}
			record := SearchRecord{
				Path: filepath.ToSlash(relative),
				Lines: []SearchLine{
					{
						Line: line,
						Text: text,
					},
				},
			}
			result = append(result, &record)
			resultMap[path] = &record
		}
	}
	js, err := json.Marshal(result)
	if err != nil {
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		return
	}
	writer.WriteHeader(http.StatusOK)
	writer.Header().Set("Content-Type", "application/json")
	_, _ = writer.Write(js)
}

type SearchRecord struct {
	Path  string
	Lines []SearchLine
}

type SearchLine struct {
	Line int
	Text string
}
