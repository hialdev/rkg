package main

import (
	"aldev/connection"
	"fmt"
	"log"
)

func main() {
	// Inisialisasi koneksi DB
	connection.InitDB()
	db := connection.DB

	// --- Execute SQL Insert Setting Groups ---
	// Periksa dulu apakah data sudah ada untuk mencegah duplikasi
	var count int64
	err := db.Raw("SELECT COUNT(*) FROM setting_groups WHERE id = ?", "e752233c-cf1a-4e1d-9fdd-5aa59c233281").Scan(&count).Error
	if err != nil {
		log.Fatalf("Error checking setting_groups: %v", err)
	}

	if count > 0 {
		fmt.Println("ℹ️  Setting Groups data already exists, skipping insert.")
	} else {
		settingGroupSQL := `
		INSERT INTO "public"."setting_groups" ("created_at", "description", "icon", "id", "name", "updated_at") VALUES
		('2025-10-27 13:00:36.023247+07', 'Dashboard settings', 'solar:widget-2-bold-duotone', 'e752233c-cf1a-4e1d-9fdd-5aa59c233281', 'Dashboard', '2025-10-27 13:00:36.023247+07');
		`
		if err := db.Exec(settingGroupSQL).Error; err != nil {
			log.Fatalf("Failed to insert setting_groups: %v", err)
		}
		fmt.Println("✅ Setting Groups inserted")
	}

	// --- Execute SQL Insert Settings ---
	err = db.Raw("SELECT COUNT(*) FROM settings WHERE id = ?", "2c148a47-5edb-4a6b-a8e4-1d01930cf90a").Scan(&count).Error
	if err != nil {
		log.Fatalf("Error checking settings: %v", err)
	}

	if count > 0 {
		fmt.Println("ℹ️  Settings data already exists, skipping insert.")
	} else {
		settingsSQL := `
		INSERT INTO "public"."settings" ("created_at", "description", "group_id", "id", "is_urgent", "name", "set_key", "set_options", "set_type", "set_value", "updated_at") VALUES
		('2025-10-27 13:16:07.329246+07', 'Theme default color', 'e752233c-cf1a-4e1d-9fdd-5aa59c233281', '2c148a47-5edb-4a6b-a8e4-1d01930cf90a', true, 'Theme Color', 'dash.theme', 'green, blue, purple, red, yellow', 'select', 'green', '2025-10-27 13:33:33.724453+07'),
		('2025-10-27 13:01:33.832474+07', 'Logo for admin dashboard', 'e752233c-cf1a-4e1d-9fdd-5aa59c233281', '38740591-976b-4cd6-8ba7-07403349d077', true, 'Logo Dashboard', 'dash.logo', '', 'image', 'uploads/settings/1761552520126185000_519feed438ac46faa95b4c608475b510_rkgiconmantap.webp', '2025-10-27 15:08:40.14848+07'),
		('2025-10-27 14:40:55.532272+07', 'Dashboard Favicon', 'e752233c-cf1a-4e1d-9fdd-5aa59c233281', 'b3d9581a-834c-4fbf-878e-b7ca1d80ca40', true, 'Favicon', 'dash.favicon', '', 'image', 'uploads/settings/1761552549705393000_f3f91c41118c4cd1b5df6267da2d37e3_rkgtour.webp', '2025-10-27 15:09:09.726831+07');
		`
		if err := db.Exec(settingsSQL).Error; err != nil {
			log.Fatalf("Failed to insert settings: %v", err)
		}
		fmt.Println("✅ Settings inserted")
	}

	fmt.Println("🎉 SQL seeding complete!")
}