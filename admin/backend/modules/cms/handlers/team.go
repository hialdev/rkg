package handlers

import (
	"aldev/modules/cms/models"
	"aldev/utils"
	"fmt"
	"strconv"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TeamInitialInput struct {
	Name    *string `json:"name" validate:"omitempty,max=300"`
	Role    *string `json:"role" validate:"omitempty,max=300"`
	Summary *string `json:"summary,omitempty" validate:"omitempty"`
	Image   *string `json:"image,omitempty" validate:"omitempty"`
}

type TeamHandler struct {
	DB *gorm.DB
}

func NewTeamHandler(db *gorm.DB) *TeamHandler {
	return &TeamHandler{DB: db}
}

func (h *TeamHandler) GetTeam(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		return utils.RespApi(c, "bad", "Id yang diberikan tidak valid", nil)
	}

	var team models.Team
	if err := h.DB.First(&team, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal mendapatkan data Team", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil mendapatkan data Team", team)
}

func (h *TeamHandler) GetAllTeams(c *fiber.Ctx) error {
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))
	search := strings.ToLower(c.Query("search", ""))
	sort := c.Query("sort", "id")
	order := c.Query("order", "asc")

	offset := (page - 1) * limit

	db := h.DB.Model(&models.Team{})

	// --- Filter search
	if search != "" {
	db = db.Where(`
			LOWER(name) LIKE ? OR 
			LOWER(role) LIKE ? OR 
			LOWER(summary) LIKE ?`,
			"%"+search+"%", "%"+search+"%", "%"+search+"%",
		)
	}

	// --- Hitung total
	var total int64
	if err := db.Count(&total).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal hitung total", err.Error())
	}

	// --- Sorting (whitelisted)
	validSortFields := map[string]string{
	"id":    "id",
		"name":  "name",
		"role": "role",
		"summary": "summary",
		"created_at":  "created_at",
	}
	sortBy, ok := validSortFields[sort]
	if !ok {
		sortBy = "id"
	}
	db = db.Order(fmt.Sprintf("%s %s", sortBy, order))

	// --- Ambil data
	var teams []models.Team
	if err := db.Offset(offset).Limit(limit).Find(&teams).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal ambil data", err.Error())
	}

	totalPages := (total + int64(limit) - 1) / int64(limit)

	// Konversi teams ke format yang bisa di-serialize dengan benar
	var responseTeams []map[string]interface{}
	for _, team := range teams {
		// Buat response object dengan format JSON yang benar
		responseTeam := map[string]interface{}{
			"id":          team.ID,
			"created_at":  team.CreatedAt,
			"updated_at":  team.UpdatedAt,
			"name":        team.Name,
			"role":        team.Role,
			"summary":     team.Summary,
			"image":       team.Image,
		}
	responseTeams = append(responseTeams, responseTeam)
	}

	result := fiber.Map{
	"teams": responseTeams,
		"pagination": fiber.Map{
			"total":      total,
			"page":       page,
			"limit":      limit,
			"totalPages": totalPages,
		},
	}

	return utils.RespApi(c, "ok", "Berhasil mendapatkan data Teams", result)
}

func (h *TeamHandler) AddTeam(c *fiber.Ctx) error {
	var input TeamInitialInput

	contentType := c.Get("Content-Type")
	if strings.Contains(contentType, "multipart/form-data") {
		// Handle multipart form data for file uploads
		name := c.FormValue("name")
		role := c.FormValue("role")
		summary := c.FormValue("summary")

		input = TeamInitialInput{
			Name:    &name,
			Role:    &role,
			Summary: &summary,
		}

		// Handle file upload
		if file, err := c.FormFile("image"); err == nil && file != nil {
			filePath, err := utils.UploadFile(c, "image", "teams")
			if err != nil {
				return utils.RespApi(c, "bad", "Gagal upload image Team", err.Error())
			}
			input.Image = &filePath
		}
	} else {
		// Handle JSON data
		if err := c.BodyParser(&input); err != nil {
			return utils.RespApi(c, "bad", "Request Body tidak valid", err.Error())
		}
	}

	if err := utils.Validate.Struct(input); err != nil {
		if verrs, ok := err.(validator.ValidationErrors); ok {
			return utils.RespApi(c, "bad", "Validasi gagal", verrs.Translate(utils.Translator))
		}
	return utils.RespApi(c, "bad", "Validasi gagal", err.Error())
	}

	team := models.Team{
		Name:    input.Name,
		Role:    input.Role,
		Summary: input.Summary,
		Image:   input.Image,
	}

	if err := h.DB.Create(&team).Error; err != nil {
		return utils.RespApi(c, "ise", "Tidak dapat membuat Team", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil membuat data Team", team)
}

func (h *TeamHandler) UpdateTeam(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
	return utils.RespApi(c, "bad", "ID yang diberikan tidak valid", nil)
	}

	var team models.Team
	if err := h.DB.First(&team, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal Mendapatkan Team", err.Error())
	}

	var input TeamInitialInput

	contentType := c.Get("Content-Type")
	if strings.Contains(contentType, "multipart/form-data") {
		// Handle multipart form data for file uploads
		name := c.FormValue("name")
		role := c.FormValue("role")
		summary := c.FormValue("summary")

		input = TeamInitialInput{
			Name:    &name,
			Role:    &role,
			Summary: &summary,
		}

		// Handle file upload
		if file, err := c.FormFile("image"); err == nil && file != nil {
			oldImagePath := ""
			if team.Image != nil {
				oldImagePath = *team.Image
			}

			filePath, err := utils.UpdateFile(c, oldImagePath, "image", "teams")
			if err != nil {
				return utils.RespApi(c, "bad", "Gagal memperbarui image Team", err.Error())
			}
			input.Image = &filePath
		}
	} else {
		// Handle JSON data
		if err := c.BodyParser(&input); err != nil {
			return utils.RespApi(c, "bad", "Request Body tidak valid", err.Error())
	}
	}

	if err := utils.Validate.Struct(input); err != nil {
		if verrs, ok := err.(validator.ValidationErrors); ok {
			return utils.RespApi(c, "bad", "Validasi gagal", verrs.Translate(utils.Translator))
		}
	return utils.RespApi(c, "bad", "Validasi gagal", err.Error())
	}

	updates := map[string]interface{}{
		"name":    input.Name,
		"role":    input.Role,
		"summary": input.Summary,
		"image":   input.Image,
	}

	if err := h.DB.Model(&team).Updates(updates).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal memperbarui data Team", err.Error())
	}

	// Ambil data terbaru
	if err := h.DB.First(&team, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal mendapatkan data terbaru", err.Error())
	}

	// Buat response object dengan format JSON yang benar
	responseTeam := map[string]interface{}{
		"id":          team.ID,
		"created_at":  team.CreatedAt,
		"updated_at":  team.UpdatedAt,
		"name":        team.Name,
	"role":        team.Role,
		"summary":     team.Summary,
		"image":       team.Image,
	}

	return utils.RespApi(c, "ok", "Berhasil memperbarui data Team", responseTeam)
}

func (h *TeamHandler) DeleteTeam(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return utils.RespApi(c, "bad", "ID yang diberikan tidak valid", nil)
	}

	var team models.Team
	if err := h.DB.First(&team, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal Mendapatkan Team", err.Error())
	}

	// Hapus file terkait jika ada
	if team.Image != nil && *team.Image != "" {
		utils.DeleteFile(*team.Image)
	}

	if err := h.DB.Delete(&team).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal Menghapus Team", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil Menghapus Team", nil)
}
