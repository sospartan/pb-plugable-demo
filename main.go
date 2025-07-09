package main

import (
	"log"

	"github.com/sospartan/pocketbase"
	"github.com/sospartan/pocketbase/plugins/uiplugin"
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
