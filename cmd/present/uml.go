package main

import (
	"html/template"
	"io"
	"io/ioutil"
	"os"
	"os/exec"
	"path/filepath"
)

var umlJarPath string

func genUML(originFile string) template.HTML {
	if result, err := genUML0(originFile); err == nil {
		return template.HTML(result)
	} else {
		return template.HTML("Fail to render uml: " + err.Error())
	}
}
func genUML0(originFile string) (string, error) {
	reader, err := os.Open(originFile)
	if err != nil {
		return "", err
	}

	tmpDir := os.TempDir()
	file, err := ioutil.TempFile(tmpDir, "uml-*.txt")
	if err != nil {
		return "", err
	}
	filePath := file.Name()
	_, err = io.Copy(file, reader)
	if err != nil {
		return "", err
	}

	ext := filepath.Ext(filePath)
	svgFilePath := filePath[0:len(filePath)-len(ext)] + ".svg"
	_, err = os.Create(svgFilePath)
	if err != nil {
		return "", err
	}
	cmd := exec.Command("java", "-jar", umlJarPath, "-tsvg", filePath)
	err = cmd.Run()
	if err != nil {
		return "", err
	}
	svgFile, err := os.Open(svgFilePath)
	if _, err = os.Stat(svgFilePath); err != nil {
		return "", err
	}
	bytes, err := ioutil.ReadAll(svgFile)
	if err != nil {
		return "", err
	}
	return string(bytes), nil
}
