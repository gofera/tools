package main

import (
	"golang.org/x/tools/cmd/present/core"
	"log"
)

func main() {
	start, err := present_core.Start()
	if err != nil {
		log.Fatal(err)
	} else {
		log.Fatal(start())
	}
}
