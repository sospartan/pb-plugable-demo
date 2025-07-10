package migrations

import (
	"github.com/sospartan/pocketbase/core"
	m "github.com/sospartan/pocketbase/migrations"
	"github.com/sospartan/pocketbase/tools/types"
)

func init() {
	m.Register(func(app core.App) error {
		// Create a new base collection for todos
		collection := core.NewBaseCollection("todos")

		// Add custom fields
		collection.Fields.Add(
			&core.TextField{
				Name:     "title",
				Required: true,
				Max:      255,
			},
			&core.TextField{
				Name: "description",
				Max:  1000,
			},
			&core.BoolField{
				Name: "completed",
			},
			&core.AutodateField{
				Name:     "created",
				OnCreate: true,
			},
			&core.AutodateField{
				Name:     "updated",
				OnCreate: true,
				OnUpdate: true,
			},
		)

		// Set list and view rules to allow public access (you can modify these as needed)
		collection.ListRule = types.Pointer("")
		collection.ViewRule = types.Pointer("")
		collection.CreateRule = types.Pointer("")
		collection.UpdateRule = types.Pointer("")
		collection.DeleteRule = types.Pointer("")

		// Add index for better performance on completed field
		collection.AddIndex("idx_todos_completed", false, "completed", "")

		return app.Save(collection)
	}, func(app core.App) error {
		// Revert operation - delete the collection
		collection, err := app.FindCollectionByNameOrId("todos")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}
