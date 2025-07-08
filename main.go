package main

import (
	"log"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/plugins/uiplugin"
	_ "github.com/sospartan/pb-plugable-demo/ui-plugins/simple_react"
)

func main() {
	app := pocketbase.New()

	log.Println("PocketBase app initialized successfully!")
	log.Printf("Using local pocketbase version from ./pocketbase directory")

	// ui-plugin command
	uiplugin.MustRegister(app, app.RootCmd, uiplugin.Config{
		Dir: "ui-plugins",
	})
	

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
