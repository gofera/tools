package present_core

import (
	"bytes"
	"html/template"
	"io"
	"io/ioutil"
	"os"
	"os/exec"
	"path/filepath"
)

var umlJarPath string

func genUML(content []byte) template.HTML {
	if result, err := genUML0(content); err == nil {
		return template.HTML(result)
	} else {
		return template.HTML("Fail to render uml: " + err.Error())
	}
}
func genUML0(content []byte) (string, error) {
	tmpDir := os.TempDir()
	file, err := ioutil.TempFile(tmpDir, "uml-*.txt")
	if err != nil {
		return "", err
	}
	filePath := file.Name()
	_, err = io.Copy(file, bytes.NewReader(content))
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
	bs, err := ioutil.ReadAll(svgFile)
	if err != nil {
		return "", err
	}
	return string(bs), nil
}
