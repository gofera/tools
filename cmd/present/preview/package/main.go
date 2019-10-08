package main

import (
	"fmt"
	"github.com/otiai10/copy"
	"log"
	"os"
	"os/exec"
	"path/filepath"
)

//go:generate go run main.go output/WebPPT-Previewer ../..

var resFolders = []string{
	"lib",
	"static",
	"templates",
}

// args: <output folder> <present folder>
func main() {
	outputDir, err := filepath.Abs(os.Args[1])
	noError(err)

	presentDir, err := filepath.Abs(os.Args[2])
	noError(err)

	fmt.Println("To package WebPPT Previewer at: %s", outputDir)
	noError(os.MkdirAll(outputDir, 0644))

	fmt.Println("To build binary")
	cmd := exec.Command("go", "build", "-o", "res/present.exe", "-mod=vendor", "golang.org/x/tools/cmd/present/preview")
	cmd.Dir = outputDir
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	noError(cmd.Run())

	fmt.Println("To copy resources")
	for _, folder := range resFolders {
		noError(copy.Copy(filepath.Join(presentDir, folder), filepath.Join(outputDir, "res", folder)))
	}

	fmt.Println("To copy cmd")
	noError(copy.Copy(filepath.Join(presentDir, "preview", "package", "run.cmd"), filepath.Join(outputDir, "WebPPT.cmd")))

	fmt.Println("To copy README")
	noError(copy.Copy(filepath.Join(presentDir, "preview", "package", "user_guide.md"), filepath.Join(outputDir, "README.md")))
}

func noError(err error) {
	if err != nil {
		log.Fatal(err)
	}
}
