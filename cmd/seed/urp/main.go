package main

import (
	"aldev/connection"
	"aldev/modules/auth/models"
	"fmt"
	"log"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("❗ Gagal mendapatkan data file .env", err.Error())
	}

	// inisialisasi koneksi DB
	connection.InitDB()
	db := connection.DB

	// --- Step 1: Seed permissions ---
	permissions := []models.Permission{
		{Name: "Read User", Description: strPtr("Can get data users")},
		{Name: "Assign User", Description: strPtr("Can assign roles to users")},

		{Name: "Read Setting", Description: strPtr("Can read setting")},
		{Name: "Add Setting", Description: strPtr("Can Add setting")},
		{Name: "Update Setting", Description: strPtr("Can Update setting")},
		{Name: "Delete Setting", Description: strPtr("Can Delete setting")},
	}

	for _, p := range permissions {
		var existing models.Permission
		err := db.Where("name = ?", p.Name).First(&existing).Error
		if err != nil {
			db.Create(&p)
		}
	}
	fmt.Println("✅ Permissions seeded")

	// --- Step 2: Create Super Admin role ---
	var superAdmin models.Role
	err = db.Where("name = ?", "Super Admin").First(&superAdmin).Error
	if err != nil {
		superAdmin = models.Role{Name: "Super Admin", Description: strPtr("Full system access")}
		db.Create(&superAdmin)
	}

	// Attach all permissions to Super Admin
	var allPermissions []models.Permission
	db.Find(&allPermissions)
	db.Model(&superAdmin).Association("Permissions").Replace(allPermissions)
	fmt.Println("✅ Super Admin role created with all permissions")

	// --- Step 3: Create Super Admin user ---
	var user models.User
	err = db.Where("username = ?", "hialdev").First(&user).Error
	if err != nil {

		user = models.User{
			Name:     strPtr("Hi AL Dev"),
			Username: strPtr("hialdev"),
			Email:    strPtr("mna.official12@gmail.com"),
			Phone:    strPtr("+6289671052050"),
			RoleID:   &superAdmin.ID,
		}

		db.Create(&user)

		fmt.Println("✅ Super Admin user created: hialdev / #MusthofaSAW12")
	} else {
		fmt.Println("ℹ️  Super Admin user already exists")
	}

	fmt.Println("🎉 Seeding complete!")
}

func strPtr(s string) *string {
	return &s
}
