package socket

import (
	"errors"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

type ScriptRunner struct {
	Ext []string
	Bin []string
	Run func(p *process, bin string, args []string, file string) error
}

func (p *process) startScript(body string, opt *Options) error {
	scriptFile := filepath.Join(tmpdir, "script"+strconv.Itoa(<-uniq))
	_ = os.Remove(scriptFile)

	err := ioutil.WriteFile(scriptFile, []byte(body), 0666)
	if err != nil {
		return err
	}
	p.bin = scriptFile

	for _, s := range scripts {
		for _, b := range s.Ext {
			if b == opt.Ext[1:] {
				return s.Run(p, s.Bin[0], nil, scriptFile)
			}
		}
	}
	return errors.New(fmt.Sprint("Unsupported Language:", opt.Ext))
}

func (p *process) startScriptByShebang(bin string, args []string, body string) error {
	scriptFile := filepath.Join(tmpdir, "script"+strconv.Itoa(<-uniq))
	_ = os.Remove(scriptFile)

	body = strings.TrimSpace(body)
	if i := strings.Index(body, "\n"); i >= 0 {
		body = body[i+1:]
	}

	err := ioutil.WriteFile(scriptFile, []byte(body), 0666)
	if err != nil {
		return err
	}
	p.bin = scriptFile

	for _, s := range scripts {
		for _, b := range s.Bin {
			if b == bin {
				return s.Run(p, bin, args, scriptFile)
			}
		}
	}
	return errors.New(fmt.Sprint("Can't find executable to run script:", bin, args))
}

var scripts = []ScriptRunner{
	{
		Ext: []string{"py"},
		Bin: []string{"python"},
		Run: simpleRun,
	},
	{
		Ext: []string{"sh"},
		Bin: []string{"bash", "sh"},
		Run: simpleRun,
	},
	{
		Ext: []string{"lua"},
		Bin: []string{"lua"},
		Run: simpleRun,
	},
}

func simpleRun(p *process, bin string, args []string, file string) error {
	dir, file := filepath.Split(file)
	cmd := p.cmd(dir, merge(bin, args, file)...)
	if err := cmd.Start(); err != nil {
		return err
	}
	p.run = cmd
	return nil
}

func merge(bin string, args []string, file string) []string {
	result := make([]string, len(args)+2)
	result[0] = bin
	copy(result[1:], args)
	result[len(args)+1] = file
	return result
}
