package handlers

import (
	"aldev/connection"
	"aldev/modules/auth/models"
	"aldev/utils"
	"errors"
	"strings"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ProfileUpdateInput struct {
	CountryCode string  `json:"country_code" validate:"required,min=2,max=4"`
	Name        string  `json:"name" validate:"required,min=2,max=20"`
	Username    string  `json:"username" validate:"required,min=4,max=12"`
	Phone       string  `json:"phone" validate:"required,min=4,max=14"`
	Email       string  `json:"email" validate:"email,omitempty,min=6"`
	Image       *string `json:"image"`
	RoleID      *string `json:"role_id,omitempty" validate:"omitempty"`
}

type ProfileHandler struct {
	DB *gorm.DB
}

func NewProfileHandler(db *gorm.DB) *ProfileHandler {
	return &ProfileHandler{DB: db}
}

func (h *ProfileHandler) Get(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		return utils.RespApi(c, "bad", "ID yang diberikan tidak valid", nil)
	}
	var profile models.User
	if err := h.DB.Preload("Role.Permissions").First(&profile, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return utils.RespApi(c, "empty", "User tidak ditemukan", nil)
		}
	}
	return utils.RespApi(c, "ok", "Berhasil mengambil data profile", profile)
}

func (h *ProfileHandler) Update(c *fiber.Ctx) error {
	// Input Struct dan Validasi
	var input ProfileUpdateInput
	if err := utils.Validate.Struct(input); err != nil {
		if verrs, ok := err.(validator.ValidationErrors); ok {
			return utils.RespApi(c, "bad", "Validasi gagal", verrs.Translate(utils.Translator))
		}
		return utils.RespApi(c, "bad", "Validasi gagal", err.Error())
	}

	// Ambil User dari db
	idStr := c.Params("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		return utils.RespApi(c, "bad", "ID yang diberikan tidak valid", nil)
	}

	var user models.User
	if err := h.DB.First(&user, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "empty", "User tidak ditemukan", err.Error())
	}

	contentType := c.Get("Content-Type")
	if strings.Contains(contentType, "multipart/form-data") {
		roleIDStr := c.FormValue("role_id")
		input.CountryCode = c.FormValue("country_code")
		input.Name = c.FormValue("name")
		input.Username = c.FormValue("username")
		input.Phone = c.FormValue("phone")
		input.Email = c.FormValue("email")
		input.RoleID = &roleIDStr
	} else {
		if err := c.BodyParser(&input); err != nil {
			return utils.RespApi(c, "bad", "Invalid input", err.Error())
		}
	}

	// Map untuk menyimpan perubahan
	updUser := make(map[string]interface{})

	// --- Update Name ---
	if input.Name != "" && (user.Name == nil || input.Name != *user.Name) {
		updUser["name"] = input.Name
	}

	// --- Update Username ---
	if input.Username != "" && (user.Username == nil || input.Username != *user.Username) {
		var count int64
		h.DB.Model(&models.User{}).Where("username = ? AND id != ?", input.Username, id).Count(&count)
		if count > 0 {
			return utils.RespApi(c, "bad", "Username sudah digunakan", nil)
		}
		updUser["username"] = input.Username
	}

	// --- Upload Image ---
	oldImage := user.Image
	if file, err := c.FormFile("image"); err == nil && file != nil {
		var oldImagePath string
		if oldImage != nil {
			oldImagePath = *oldImage
		}

		filePath, err := utils.UpdateFile(c, oldImagePath, "image", "users")
		if err != nil {
			return utils.RespApi(c, "bad", "Gagal memperbarui image User", err.Error())
		}

		updUser["image"] = filePath

		if oldImage != nil && *oldImage != "" {
			go utils.DeleteFile(*oldImage) // async delete
		}
	}

	// --- Lakukan Update Hanya Jika Ada Perubahan ---
	if len(updUser) > 0 {
		if err := h.DB.Model(&user).Updates(updUser).Error; err != nil {
			return utils.RespApi(c, "ise", "Gagal Memperbarui User", err.Error())
		}
	}

	// --- Reload User ---
	var updatedUser models.User
	if err := h.DB.Preload("Role").First(&updatedUser, id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal mengambil data user setelah update", err.Error())
	}

	userName := "User"
	if updatedUser.Name != nil {
		userName = *updatedUser.Name
	}
	connection.DeleteKeysByPattern(c.Context(), "users:*")

	return utils.RespApi(c, "ok", userName+" berhasil diperbarui", updatedUser)
}

func (h *ProfileHandler) UpdateEmail(c *fiber.Ctx) error {
	var input struct {
		Code    string `json:"code" validate:"required,len=6"`
		Email   string `json:"email" validate:"required,email,min=6"`
		Purpose string `json:"purpose" validate:"required,oneof=register changes verify login"`
	}
	if err := utils.Validate.Struct(input); err != nil {
		if verrs, ok := err.(validator.ValidationErrors); ok {
			return utils.RespApi(c, "bad", "Validasi gagal", verrs.Translate(utils.Translator))
		}
		return utils.RespApi(c, "bad", "Validasi gagal", err.Error())
	}

	// Get User
	idStr := c.Params("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		return utils.RespApi(c, "bad", "ID yang diberikan tidak valid", nil)
	}

	var user models.User
	if err := h.DB.First(&user, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "empty", "User tidak ditemukan", err.Error())
	}

	// Check OTP
	var otp models.Otp
	if err := h.DB.Where("code = ? AND purpose = ? AND email = ?", input.Code, input.Purpose, user.Email).First(&otp).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return utils.RespApi(c, "bad", "Kode OTP tidak valid", nil)
		}
		return utils.RespApi(c, "ise", "Gagal memverifikasi kode OTP", err.Error())
	}

	//Check Expired OTP
	if otp.ExpiredAt.Before(time.Now()) {
		// Delete expired OTP
		if err := h.DB.Delete(&otp).Error; err != nil {
			return utils.RespApi(c, "ise", "Gagal menghapus OTP kadaluarsa", err.Error())
		}
		return utils.RespApi(c, "bad", "Kode OTP sudah kadaluarsa", nil)
	}

	// --- Update Email ---
	if input.Email != "" && (user.Email == nil || input.Email != *user.Email) {
		var count int64
		h.DB.Model(&models.User{}).Where("email = ? AND id != ?", input.Email, id).Count(&count)
		if count > 0 {
			return utils.RespApi(c, "bad", "Email sudah digunakan oleh user lain", nil)
		}

		user.Email = &input.Email
		if err := h.DB.Save(&user).Error; err != nil {
			return utils.RespApi(c, "ise", "Gagal Memperbarui Email User", err.Error())
		}
	}

	// Delete OTP
	if err := h.DB.Delete(&otp).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return utils.RespApi(c, "empty", "Data OTP tidak ditemukan", nil)
		}
		return utils.RespApi(c, "ise", "Gagal menghapus data OTP", err.Error())
	}

	// --- Reload User ---
	var updatedUser models.User
	if err := h.DB.Preload("Role").First(&updatedUser, id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal mengambil data user setelah update", err.Error())
	}

	userName := "User"
	if updatedUser.Name != nil {
		userName = *updatedUser.Name
	}
	connection.DeleteKeysByPattern(c.Context(), "users:*")

	return utils.RespApi(c, "ok", userName+" berhasil diperbarui", updatedUser)
}

func (h *ProfileHandler) UpdatePhone(c *fiber.Ctx) error {
	var input struct {
		Code        string `json:"code" validate:"required,len=6"`
		Phone       string `json:"phone" validate:"required,min=4,max=14"`       // Phone baru
		CountryCode string `json:"country_code" validate:"required,min=2,max=3"` // Phone baru
		Purpose     string `json:"purpose" validate:"required,oneof=register changes verify login"`
	}
	if err := utils.Validate.Struct(input); err != nil {
		if verrs, ok := err.(validator.ValidationErrors); ok {
			return utils.RespApi(c, "bad", "Validasi gagal", verrs.Translate(utils.Translator))
		}
		return utils.RespApi(c, "bad", "Validasi gagal", err.Error())
	}

	// Get User
	idStr := c.Params("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		return utils.RespApi(c, "bad", "ID yang diberikan tidak valid", nil)
	}

	var user models.User
	if err := h.DB.First(&user, "id = ?", id).Error; err != nil {
		return utils.RespApi(c, "empty", "User tidak ditemukan", err.Error())
	}

	// Check OTP
	var otp models.Otp
	if err := h.DB.Where("code = ? AND purpose = ? AND phone = ?", input.Code, input.Purpose, user.Phone).First(&otp).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return utils.RespApi(c, "bad", "Kode OTP tidak valid", nil)
		}
		return utils.RespApi(c, "ise", "Gagal memverifikasi kode OTP", err.Error())
	}

	//Check Expired OTP
	if otp.ExpiredAt.Before(time.Now()) {
		// Delete expired OTP
		if err := h.DB.Delete(&otp).Error; err != nil {
			return utils.RespApi(c, "ise", "Gagal menghapus OTP kadaluarsa", err.Error())
		}
		return utils.RespApi(c, "bad", "Kode OTP sudah kadaluarsa", nil)
	}

	parsedPhone, err := utils.NormalizePhone(input.Phone, input.CountryCode)
	if err != nil {
		return utils.RespApi(c, "bad", "Nomor telepon tidak valid untuk negara "+input.CountryCode, nil)
	}
	// --- Update Phone ---
	if parsedPhone != "" && (user.Phone == nil || parsedPhone != *user.Phone) {
		var count int64
		h.DB.Model(&models.User{}).Where("phone = ? AND id != ?", parsedPhone, id).Count(&count)
		if count > 0 {
			return utils.RespApi(c, "bad", "Nomor telepon sudah digunakan oleh user lain", nil)
		}
		user.Phone = &parsedPhone
		if err := h.DB.Save(&user).Error; err != nil {
			return utils.RespApi(c, "ise", "Gagal Memperbarui Phone User", err.Error())
		}
	}

	// Delete OTP
	if err := h.DB.Delete(&otp).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return utils.RespApi(c, "empty", "Data OTP tidak ditemukan", nil)
		}
		return utils.RespApi(c, "ise", "Gagal menghapus data OTP", err.Error())
	}

	// --- Reload User ---
	var updatedUser models.User
	if err := h.DB.Preload("Role").First(&updatedUser, id).Error; err != nil {
		return utils.RespApi(c, "ise", "Gagal mengambil data user setelah update", err.Error())
	}

	userName := "User"
	if updatedUser.Name != nil {
		userName = *updatedUser.Name
	}

	connection.DeleteKeysByPattern(c.Context(), "users:*")

	return utils.RespApi(c, "ok", userName+" berhasil diperbarui", updatedUser)
}
