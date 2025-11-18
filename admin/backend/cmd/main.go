package main

import (
	"aldev/connection"
	"aldev/modules/auth/models"
	CMSModels "aldev/modules/cms/models"
	"aldev/routes"
	"aldev/utils"
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	time.LoadLocation(os.Getenv("APP_TIMEZONE"))

	utils.ValidationTranslationInit()

	app := fiber.New()
	// app.Use(cors.New(cors.Config{
	//      AllowOrigins:     "http://localhost:8081, http://localhost:8082",
	//      AllowMethods:     "GET,POST,DELETE",
	//      AllowHeaders:     "Origin,Content-Type,Authorization",
	//      AllowCredentials: true,
	//  }))

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:8082, http://localhost:8000, http://172.245.53.218:8082",
		AllowMethods:     "GET,POST,DELETE,PATCH",
		AllowHeaders:     "Origin,Content-Type,Authorization",
		AllowCredentials: true,
	}))

	connection.InitDB()
	connection.InitRedis()
	connection.InitWAClient()
	err := connection.InitEmail()
	if err != nil {
		log.Fatalf("Email init failed: %v", err)
	}

	//Migration
	connection.DB.AutoMigrate(
		// Auth + RBAC
		&models.User{},
		&models.Role{},
		&models.Permission{},
		&models.Otp{},

		// CMS
		&CMSModels.SettingGroup{},
		&CMSModels.Setting{},
		&CMSModels.Tables{},
		&CMSModels.TableField{},
		&CMSModels.TableRecord{},
	)

	routes.InitRoutes(app, connection.DB)
	app.Static("/uploads", "./uploads")
	app.Listen(":"+os.Getenv("APP_PORT"))
}
