package socket

import (
	"io/ioutil"
	"os"
	"path/filepath"
	"strconv"
)

func (p *process) startJava(body string, opt *Options) error {
	compDir := filepath.Join(tmpdir, "compile"+strconv.Itoa(<-uniq))
	_ = os.RemoveAll(compDir)
	err := os.MkdirAll(compDir, os.ModePerm)
	if err != nil {
		return err
	}
	path := filepath.Join(compDir, "Main")
	src := path + ".java"
	bin := path //+ ".class"

	defer os.Remove(src)

	err = ioutil.WriteFile(src, []byte(body), 0666)
	if err != nil {
		return err
	}
	p.bin = bin
	dir, file := filepath.Split(src)
	cmd := p.cmd(dir, "javac", file)
	cmd.Stdout = cmd.Stderr
	if err := cmd.Run(); err != nil {
		return err
	}

	cmd = p.cmd(dir, "java", "Main")
	if err := cmd.Start(); err != nil {
		return err
	}
	p.run = cmd
	return nil
}
