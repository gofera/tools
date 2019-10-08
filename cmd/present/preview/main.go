package main

import (
	"fmt"
	"github.com/getlantern/systray"
	"github.com/skratchdot/open-golang/open"
	"github.com/sqweek/dialog"
	"golang.org/x/tools/cmd/present/core"
	"os"
	"path/filepath"
)

var startDir = "."

func main() {
	run, err := present_core.Start()
	if err != nil {
		dialog.Message("Fail to Open WebPPT Previewer. It may running now. Error:\n%s", err.Error()).Info()
		os.Exit(1)
	} else {
		go startPreview()
		err = run()
		if err != nil {
			dialog.Message("Fail to Open WebPPT Previewer. Error:\n%s", err.Error()).Info()
		}
	}
}

func startPreview() {
	systray.Run(onReady, func() {
		dialog.Message("WebPPT Previewer Exited.").Title("Exit").Info()
		os.Exit(0)
	})
}

func onReady() {

	systray.SetIcon(ICON)
	systray.SetTitle("WebPPT Previewer")
	systray.SetTooltip("WebPPT Previewer")

	openItem := systray.AddMenuItem("Open WebPPT", "")
	quitItem := systray.AddMenuItem("Quit", "")

	dialog.Message("WebPPT Previewer started.\nGo to tray to open your WebPPT file.\nFor details, you can read README file.").Title("Start").Info()

	for {
		select {
		case <-openItem.ClickedCh:
			file, err := dialog.File().
				Title("Choose WebPPT file").
				Filter("WebPPT (*.slide, *.slides)", "slide", "slides").
				SetStartDir(startDir).
				Load()
			if err == nil {
				startDir = filepath.Dir(file)
				err := open.Run(fmt.Sprintf("http://127.0.0.1:3999/online/?path=file://%s", filepath.ToSlash(file)))
				if err != nil {
					dialog.Message("Fail to open preview. Error:\n%s", err.Error())
				}
			}
		case <-quitItem.ClickedCh:
			systray.Quit()
		}
	}
}
