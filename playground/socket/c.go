package socket

import (
	"io/ioutil"
	"os"
	"path/filepath"
	"strconv"
)

func (p *process) startC(body string, opt *Options) error {
	compDir := filepath.Join(tmpdir, "gcc_"+strconv.Itoa(<-uniq))
	_ = os.RemoveAll(compDir)
	err := os.MkdirAll(compDir, os.ModePerm)
	if err != nil {
		return err
	}
	src := filepath.Join(compDir, "main.c")

	err = ioutil.WriteFile(src, []byte(body), 0666)
	if err != nil {
		return err
	}
	p.bin = compDir
	dir, file := filepath.Split(src)
	cmd := p.cmd(dir, "gcc", file)
	cmd.Stdout = cmd.Stderr
	if err := cmd.Run(); err != nil {
		return err
	}

	cmd = p.cmd(dir, "./out")
	if err := cmd.Start(); err != nil {
		return err
	}
	p.run = cmd
	return nil
}

// TODO: duplicate with startC, need to merge together
func (p *process) startCpp(body string, opt *Options) error {
	compDir := filepath.Join(tmpdir, "gcc_"+strconv.Itoa(<-uniq))
	_ = os.RemoveAll(compDir)
	err := os.MkdirAll(compDir, os.ModePerm)
	if err != nil {
		return err
	}
	src := filepath.Join(compDir, "main.cpp")

	err = ioutil.WriteFile(src, []byte(body), 0666)
	if err != nil {
		return err
	}
	p.bin = compDir
	dir, file := filepath.Split(src)
	cmd := p.cmd(dir, "gcc", file)
	cmd.Stdout = cmd.Stderr
	if err := cmd.Run(); err != nil {
		return err
	}

	cmd = p.cmd(dir, "./out")
	if err := cmd.Start(); err != nil {
		return err
	}
	p.run = cmd
	return nil
}
