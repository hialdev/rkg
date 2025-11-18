package routes

import (
	"aldev/modules/cms/handlers"
	"aldev/routes/middlewares"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func SetupCMSRoutes(app *fiber.App, db *gorm.DB) {
	api := app.Group("/api")

	set_group := handlers.NewSettingGroupHandler(db)
	sgroup := api.Group("/setting-groups")
	sgroup.Use(middlewares.JWTProtected())
	sgroup.Use(middlewares.DoACL("Read Setting")).Get("/", set_group.GetAllSettingGroups)
	sgroup.Use(middlewares.DoACL("Read Setting")).Get("/:id", set_group.GetSettingGroup)
	sgroup.Use(middlewares.DoACL("Add Setting")).Post("/", set_group.CreateSettingGroup)
	sgroup.Use(middlewares.DoACL("Update Setting")).Patch("/:id", set_group.UpdateSettingGroup)
	sgroup.Use(middlewares.DoACL("Delete Setting")).Delete("/:id", set_group.DeleteSettingGroup)

	settings := handlers.NewSettingHandler(db)
	setting := api.Group("/settings")
	setting.Get("/key/:key", settings.GetSettingByKey)
	setting.Use(middlewares.JWTProtected())
	setting.Use(middlewares.DoACL("Read Setting")).Get("/:id", settings.GetSetting)
	setting.Use(middlewares.DoACL("Add Setting")).Post("/", settings.AddSetting)
	setting.Use(middlewares.DoACL("Update Setting")).Post("/:id/value", settings.ValueSetting)
	setting.Use(middlewares.DoACL("Update Setting")).Patch("/:id", settings.UpdateSetting)
	setting.Use(middlewares.DoACL("Delete Setting")).Delete("/:id", settings.DeleteSetting)

	tables := handlers.NewTableHandler(db)
	table := api.Group("/tables")
	table.Get("/", tables.GetAll)
	table.Get("/:id", tables.GetOne)
	table.Post("/", tables.Create)
	table.Patch("/:id", tables.Update)
	table.Delete("/:id", tables.Delete)

	fields := handlers.NewTableFieldHandler(db)
	field := api.Group("/fields")
	field.Get("/:table_id", fields.GetByTable)
	field.Post("/", fields.Create)
	field.Patch("/:id", fields.Update)
	field.Delete("/:id", fields.Delete)

	records := handlers.NewTableRecordHandler(db)
	record := api.Group("/records")
	record.Get("/:table_id", records.GetByTable)
	record.Post("/", records.Create)
	record.Patch("/:id", records.Update)
	record.Delete("/:id", records.Delete)
}
