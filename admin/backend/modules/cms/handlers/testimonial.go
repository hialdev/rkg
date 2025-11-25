package handlers

import (
	"aldev/modules/cms/models"
	"aldev/utils"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TestimonialInitialInput struct {
	Name    *string  `json:"name" validate:"omitempty,max=300"`
	Role    *string  `json:"role" validate:"omitempty,max=300"`
	Image   *string  `json:"image,omitempty" validate:"omitempty"`
	Quote   *string  `json:"quote" validate:"omitempty"`
	Galleries []string `json:"galleries,omitempty" validate:"omitempty,max=5"`
}

type TestimonialHandler struct {
	DB *gorm.DB
}

func NewTestimonialHandler(db *gorm.DB) *TestimonialHandler {
	return &TestimonialHandler{DB: db}
}

func (h *TestimonialHandler) GetTestimonial(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		return utils.RespApi(c, "bad", "Id yang diberikan tidak valid", nil)
	}

	var testimonial models.Testimonial
	if err := h.DB.First(&testimonial, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal mendapatkan data Testimonial", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil mendapatkan data Testimonial", testimonial)
}

func (h *TestimonialHandler) GetAllTestimonials(c *fiber.Ctx) error {
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))
	search := strings.ToLower(c.Query("search", ""))
	sort := c.Query("sort", "id")
	order := c.Query("order", "asc")

	offset := (page - 1) * limit

	db := h.DB.Model(&models.Testimonial{})

	// --- Filter search
	if search != "" {
	db = db.Where(`
			LOWER(name) LIKE ? OR 
			LOWER(role) LIKE ? OR 
			LOWER(quote) LIKE ?`,
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
		"role":  "role",
		"created_at": "created_at",
	}
	sortBy, ok := validSortFields[sort]
	if !ok {
		sortBy = "id"
	}
	db = db.Order(fmt.Sprintf("%s %s", sortBy, order))

	// --- Ambil data
	var testimonials []models.Testimonial
	if err := db.Offset(offset).Limit(limit).Find(&testimonials).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal ambil data", err.Error())
	}

	totalPages := (total + int64(limit) - 1) / int64(limit)

	// Konversi testimonials ke format yang bisa di-serialize dengan benar
	var responseTestimonials []map[string]interface{}
	for _, testimonial := range testimonials {
		// Buat response object dengan format JSON yang benar
		responseTestimonial := map[string]interface{}{
			"id":          testimonial.ID,
			"created_at":  testimonial.CreatedAt,
			"updated_at":  testimonial.UpdatedAt,
			"name":        testimonial.Name,
			"role":        testimonial.Role,
			"image":       testimonial.Image,
			"quote":       testimonial.Quote,
			"galleries":   testimonial.Galleries,
		}
		responseTestimonials = append(responseTestimonials, responseTestimonial)
	}

	result := fiber.Map{
		"testimonials": responseTestimonials,
		"pagination": fiber.Map{
			"total":      total,
			"page":       page,
			"limit":      limit,
			"totalPages": totalPages,
		},
	}

	return utils.RespApi(c, "ok", "Berhasil mendapatkan data Testimonials", result)
}

func (h *TestimonialHandler) AddTestimonial(c *fiber.Ctx) error {
	var input TestimonialInitialInput

	contentType := c.Get("Content-Type")
	if strings.Contains(contentType, "multipart/form-data") {
		// Handle multipart form data for file uploads
		name := c.FormValue("name")
		role := c.FormValue("role")
		quote := c.FormValue("quote")

		input = TestimonialInitialInput{
			Name:  &name,
			Role:  &role,
			Quote: &quote,
		}

		// Handle file upload
		if file, err := c.FormFile("image"); err == nil && file != nil {
			filePath, err := utils.UploadFile(c, "image", "testimonials")
			if err != nil {
				return utils.RespApi(c, "bad", "Gagal upload image Testimonial", err.Error())
			}
			input.Image = &filePath
		}

		// Handle galleries upload - process galleries first
		galleries := []string{}
		// Check if there are multiple files in the galleries field
		form, err := c.MultipartForm()
		if err == nil {
			galleryFiles := form.File["galleries"]
			if len(galleryFiles) > 0 {
				// Use UploadFileFlex to handle multiple files properly
				if filePaths, err := utils.UploadFileFlex(c, "galleries", "testimonials"); err == nil && len(filePaths) > 0 {
					galleries = filePaths
				}
			}
		} else {
			// Fallback to single file processing if multipart form parsing fails
			galleryFiles, _ := c.FormFile("galleries")
			if galleryFiles != nil {
				// Handle single file
				if filePath, err := utils.UploadFile(c, "galleries", "testimonials"); err == nil {
					galleries = append(galleries, filePath)
				}
			} else {
				// Handle multiple files using UploadFileFlex
				if filePaths, err := utils.UploadFileFlex(c, "galleries", "testimonials"); err == nil && len(filePaths) > 0 {
					galleries = filePaths
				}
			}
		}

		if len(galleries) > 0 {
			input.Galleries = galleries
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

	// Convert galleries slice to JSON string for storage
	var galleriesJSON *string
	if len(input.Galleries) > 0 {
		galleriesBytes, err := json.Marshal(input.Galleries)
		if err != nil {
			return utils.RespApi(c, "ise", "Gagal mengkonversi galleries ke JSON", err.Error())
		}
		galleriesStr := string(galleriesBytes)
		galleriesJSON = &galleriesStr
	}

	testimonial := models.Testimonial{
		Name:      input.Name,
		Role:      input.Role,
		Image:     input.Image,
		Quote:     input.Quote,
		Galleries: galleriesJSON,
	}

	if err := h.DB.Create(&testimonial).Error; err != nil {
		return utils.RespApi(c, "ise", "Tidak dapat membuat Testimonial", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil membuat data Testimonial", testimonial)
}

func (h *TestimonialHandler) UpdateTestimonial(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return utils.RespApi(c, "bad", "ID yang diberikan tidak valid", nil)
	}

	var testimonial models.Testimonial
	if err := h.DB.First(&testimonial, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal Mendapatkan Testimonial", err.Error())
	}

	var input TestimonialInitialInput

	contentType := c.Get("Content-Type")
	if strings.Contains(contentType, "multipart/form-data") {
		// Handle multipart form data for file uploads
		name := c.FormValue("name")
		role := c.FormValue("role")
		quote := c.FormValue("quote")

		input = TestimonialInitialInput{
			Name:  &name,
			Role: &role,
			Quote: &quote,
		}

		// Handle file upload
		if file, err := c.FormFile("image"); err == nil && file != nil {
			oldImagePath := ""
			if testimonial.Image != nil {
				oldImagePath = *testimonial.Image
			}

			filePath, err := utils.UpdateFile(c, oldImagePath, "image", "testimonials")
			if err != nil {
				return utils.RespApi(c, "bad", "Gagal memperbarui image Testimonial", err.Error())
			}
			input.Image = &filePath
		} else {
			// Jika tidak ada file image yang diupload, gunakan image yang lama
			input.Image = testimonial.Image
		}

		// Handle galleries upload
		var galleries []string
		// Parse existing galleries from JSON string if they exist
		if testimonial.Galleries != nil {
			if err := json.Unmarshal([]byte(*testimonial.Galleries), &galleries); err != nil {
				galleries = []string{} // Initialize as empty if parsing fails
			}
		}

		// Check if new gallery files are being uploaded
	galleryFiles, _ := c.MultipartForm()
		if galleryFiles != nil {
			galleryFileList := galleryFiles.File["galleries"]
			if len(galleryFileList) > 0 {
				// Upload new gallery files
				if filePaths, err := utils.UploadFileFlex(c, "galleries", "testimonials"); err == nil && len(filePaths) > 0 {
					// Append new galleries to existing galleries
					galleries = append(galleries, filePaths...)
				}
			}
		}
		input.Galleries = galleries
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

	// Convert galleries slice to JSON string for storage
	var galleriesJSON *string
	if len(input.Galleries) > 0 {
		galleriesBytes, err := json.Marshal(input.Galleries)
		if err != nil {
			return utils.RespApi(c, "ise", "Gagal mengkonversi galleries ke JSON", err.Error())
		}
		galleriesStr := string(galleriesBytes)
		galleriesJSON = &galleriesStr
	}

	updates := map[string]interface{}{
		"name":      input.Name,
		"role":      input.Role,
		"image":     input.Image,
		"quote":     input.Quote,
		"galleries": galleriesJSON,
	}

	if err := h.DB.Model(&testimonial).Updates(updates).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal memperbarui data Testimonial", err.Error())
	}

	// Ambil data terbaru
	if err := h.DB.First(&testimonial, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal mendapatkan data terbaru", err.Error())
	}

	// Buat response object dengan format JSON yang benar
	responseTestimonial := map[string]interface{}{
	"id":          testimonial.ID,
		"created_at":  testimonial.CreatedAt,
		"updated_at":  testimonial.UpdatedAt,
		"name":        testimonial.Name,
		"role":        testimonial.Role,
		"image":       testimonial.Image,
		"quote":       testimonial.Quote,
		"galleries":   testimonial.Galleries,
	}

	return utils.RespApi(c, "ok", "Berhasil memperbarui data Testimonial", responseTestimonial)
}

func (h *TestimonialHandler) DeleteTestimonial(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return utils.RespApi(c, "bad", "ID yang diberikan tidak valid", nil)
	}

	var testimonial models.Testimonial
	if err := h.DB.First(&testimonial, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal Mendapatkan Testimonial", err.Error())
	}

	// Hapus file terkait jika ada
	if testimonial.Image != nil && *testimonial.Image != "" {
		utils.DeleteFile(*testimonial.Image)
	}
	// Hapus gallery files
	if testimonial.Galleries != nil {
		var galleries []string
		if err := json.Unmarshal([]byte(*testimonial.Galleries), &galleries); err == nil {
			for _, galleryPath := range galleries {
				if galleryPath != "" {
					utils.DeleteFile(galleryPath)
				}
			}
		}
	}

	if err := h.DB.Delete(&testimonial).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal Menghapus Testimonial", err.Error())
	}

	return utils.RespApi(c, "ok", "Berhasil Menghapus Testimonial", nil)
}
