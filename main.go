package main

import (
	"log"

	_ "github.com/sospartan/pb-plugable-demo/migrations"
	_ "github.com/sospartan/pb-plugable-demo/ui-plugins/simple_react"
	"github.com/sospartan/pocketbase"
	"github.com/sospartan/pocketbase/plugins/migratecmd"
	"github.com/sospartan/pocketbase/plugins/uiplugin"
)

func main() {
	app := pocketbase.New()

	log.Println("PocketBase app initialized successfully!")
	log.Printf("Using local pocketbase version from ./pocketbase directory")

	// ui-plugin command
	uiplugin.MustRegister(app, app.RootCmd, uiplugin.Config{
		Dir: "ui-plugins",
	})

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		Dir:         "migrations",
		Automigrate: true,
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
