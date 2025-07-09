// Package simple_react handles the PocketBase UI plugin embedding.
package simple_react

import (
	"embed"
	"io/fs"

	"github.com/sospartan/pocketbase/apis"
)

//go:embed all:dist
var distDir embed.FS

var PluginDirFS, _ = fs.Sub(distDir, "dist")

func init() {
	apis.RegisterUIPlugin(apis.UiPlugin{
		Name: "simple-react",
		Base: "simple_react",
		Icon: "ri-plug-line",
		FS:   PluginDirFS,
	})
}
