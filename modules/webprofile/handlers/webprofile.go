package handlers

import (
	"aldev/modules/cms/models"
	"aldev/utils"
	"strings"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type WebProfileHandler struct {
	DB *gorm.DB
}

// GetLocations returns list of locations with country
func (h *WebProfileHandler) GetLocations(c *fiber.Ctx) error {
	var locations []struct {
		Location string `json:"location"`
		Country string `json:"country_"`
	}

	result := h.DB.Model(&models.Trip{}).
		Select("DISTINCT location, country").
		Where("location IS NOT NULL AND country IS NOT NULL").
		Find(&locations)

	if result.Error != nil {
		return utils.RespApi(c, "ise", "Failed to fetch locations", nil)
	}

	if len(locations) == 0 {
		return utils.RespApi(c, "empty", "No locations found", nil)
	}

	return utils.RespApi(c, "ok", "Locations retrieved successfully", locations)
}

// GetTrips returns trips based on type parameter or all trips
func (h *WebProfileHandler) GetTrips(c *fiber.Ctx) error {
	tripType := c.Query("type")
	locationQuery := c.Query("location") // multiple locations can be passed as comma-separated values
	slug := c.Params("slug")

	var trips []models.Trip

	query := h.DB.Model(&models.Trip{})

	if slug != "" {
	// Get specific trip by slug
	query = query.Where("slug = ?", slug)
		result := query.First(&trips)
		if result.Error != nil {
			if result.Error == gorm.ErrRecordNotFound {
				return utils.RespApi(c, "empty", "Trip not found", nil)
			}
			return utils.RespApi(c, "ise", "Failed to fetch trip", nil)
	}
	} else {
		// Apply filters for list view
		if tripType != "" {
			query = query.Where("type = ?", tripType)
		}
		
		if locationQuery != "" {
			// Split location query by comma to handle multiple locations
			locations := strings.Split(locationQuery, ",")
			// Trim spaces from each location
			for i, loc := range locations {
				locations[i] = strings.TrimSpace(loc)
			}
			
			// Use IN clause to filter by multiple locations
			query = query.Where("location IN ?", locations)
		}
		
		result := query.Find(&trips)
		if result.Error != nil {
			return utils.RespApi(c, "ise", "Failed to fetch trips", nil)
	}

		if len(trips) == 0 {
			return utils.RespApi(c, "empty", "No trips found", nil)
	}
	}

	return utils.RespApi(c, "ok", "Trips retrieved successfully", trips)
}

// GetEvents returns events or specific event by slug
func (h *WebProfileHandler) GetEvents(c *fiber.Ctx) error {
	slug := c.Params("slug")

	var events []models.Event

	if slug != "" {
		// Get specific event by slug
		result := h.DB.Where("slug = ?", slug).First(&events)
		if result.Error != nil {
			if result.Error == gorm.ErrRecordNotFound {
				return utils.RespApi(c, "empty", "Event not found", nil)
			}
			return utils.RespApi(c, "ise", "Failed to fetch event", nil)
		}
	} else {
		// Get all events
		result := h.DB.Find(&events)
	if result.Error != nil {
			return utils.RespApi(c, "ise", "Failed to fetch events", nil)
		}

		if len(events) == 0 {
			return utils.RespApi(c, "empty", "No events found", nil)
		}
	}

	return utils.RespApi(c, "ok", "Events retrieved successfully", events)
}

// GetTestimonials returns all testimonials
func (h *WebProfileHandler) GetTestimonials(c *fiber.Ctx) error {
	var testimonials []models.Testimonial

	result := h.DB.Find(&testimonials)
	if result.Error != nil {
		return utils.RespApi(c, "ise", "Failed to fetch testimonials", nil)
	}

	if len(testimonials) == 0 {
		return utils.RespApi(c, "empty", "No testimonials found", nil)
	}

	return utils.RespApi(c, "ok", "Testimonials retrieved successfully", testimonials)
}

// GetEventTypes returns event types or specific event type by slug
func (h *WebProfileHandler) GetEventTypes(c *fiber.Ctx) error {
	slug := c.Params("slug")

	var eventTypes []models.EventType

	if slug != "" {
		// Get specific event type by slug
		result := h.DB.Where("slug = ?", slug).First(&eventTypes)
		if result.Error != nil {
			if result.Error == gorm.ErrRecordNotFound {
				return utils.RespApi(c, "empty", "Event type not found", nil)
			}
			return utils.RespApi(c, "ise", "Failed to fetch event type", nil)
		}
	} else {
		// Get all event types
		result := h.DB.Find(&eventTypes)
		if result.Error != nil {
			return utils.RespApi(c, "ise", "Failed to fetch event types", nil)
		}

		if len(eventTypes) == 0 {
			return utils.RespApi(c, "empty", "No event types found", nil)
		}
	}

	return utils.RespApi(c, "ok", "Event types retrieved successfully", eventTypes)
}

// GetTeams returns all teams
func (h *WebProfileHandler) GetTeams(c *fiber.Ctx) error {
	var teams []models.Team

	result := h.DB.Find(&teams)
	if result.Error != nil {
		return utils.RespApi(c, "ise", "Failed to fetch teams", nil)
	}

	if len(teams) == 0 {
		return utils.RespApi(c, "empty", "No teams found", nil)
	}

	return utils.RespApi(c, "ok", "Teams retrieved successfully", teams)
}

// GetClients returns all clients
func (h *WebProfileHandler) GetClients(c *fiber.Ctx) error {
	var clients []models.Client

	result := h.DB.Find(&clients)
	if result.Error != nil {
		return utils.RespApi(c, "ise", "Failed to fetch clients", nil)
	}

	if len(clients) == 0 {
		return utils.RespApi(c, "empty", "No clients found", nil)
	}

	return utils.RespApi(c, "ok", "Clients retrieved successfully", clients)
}

// GetGalleries returns galleries in featured, sliders, and all format
func (h *WebProfileHandler) GetGalleries(c *fiber.Ctx) error {
	var allGalleries []map[string]interface{}

	// Get trips with image and title
	var trips []models.Trip
	h.DB.Select("image, title").Where("image IS NOT NULL AND title IS NOT NULL").Find(&trips)
	for _, trip := range trips {
		if trip.Image != nil && trip.Title != nil {
			gallery := map[string]interface{}{
				"image": *trip.Image,
				"title": *trip.Title,
			}
			allGalleries = append(allGalleries, gallery)
		}
	}

	// Get events with image and title
	var events []models.Event
	h.DB.Select("image, title").Where("image IS NOT NULL AND title IS NOT NULL").Find(&events)
	for _, event := range events {
		if event.Image != nil && event.Title != nil {
			gallery := map[string]interface{}{
				"image": *event.Image,
				"title": *event.Title,
			}
			allGalleries = append(allGalleries, gallery)
		}
	}

	// Get event types with image and title
	var eventTypes []models.EventType
	h.DB.Select("image, title").Where("image IS NOT NULL AND title IS NOT NULL").Find(&eventTypes)
	for _, eventType := range eventTypes {
		if eventType.Image != nil && eventType.Title != nil {
			gallery := map[string]interface{}{
				"image": *eventType.Image,
				"title": *eventType.Title,
			}
			allGalleries = append(allGalleries, gallery)
		}
	}

	// Get testimonials with galleries and name
	var testimonials []models.Testimonial
	h.DB.Select("galleries, name").Where("galleries IS NOT NULL AND name IS NOT NULL").Find(&testimonials)
	for _, testimonial := range testimonials {
		if testimonial.Galleries != nil && testimonial.Name != nil {
			// Parse galleries as JSON array
			galleriesStr := *testimonial.Galleries
			// Remove brackets if they exist
			galleriesStr = strings.Trim(galleriesStr, "[]")
			if galleriesStr != "" {
				// Split by comma to get individual gallery items
				galleryItems := strings.Split(galleriesStr, ",")
				for _, item := range galleryItems {
					item = strings.TrimSpace(item)
					// Remove quotes if they exist
					item = strings.Trim(item, "\"'")
					gallery := map[string]interface{}{
						"image": item,
						"title": *testimonial.Name,
					}
					allGalleries = append(allGalleries, gallery)
				}
			}
		}
	}

	// Prepare response structure
	response := map[string]interface{}{
		"featured": make([]map[string]interface{}, 0),
		"sliders":  make([]map[string]interface{}, 0),
		"all":      allGalleries,
	}

	// Limit featured and sliders to max 6
	if len(allGalleries) > 0 {
		featuredEnd := len(allGalleries)
		if featuredEnd > 6 {
			featuredEnd = 6
		}
		response["featured"] = allGalleries[0:featuredEnd]

		slidersEnd := len(allGalleries)
		if slidersEnd > 6 {
			slidersEnd = 6
		}
		response["sliders"] = allGalleries[0:slidersEnd]
	}

	return utils.RespApi(c, "ok", "Galleries retrieved successfully", response)
}

// GetEventPlans returns event plans ordered by step_order
func (h *WebProfileHandler) GetEventPlans(c *fiber.Ctx) error {
	var eventPlans []models.EventPlan

	result := h.DB.Order("step_order ASC").Find(&eventPlans)
	if result.Error != nil {
		return utils.RespApi(c, "ise", "Failed to fetch event plans", nil)
	}

	if len(eventPlans) == 0 {
		return utils.RespApi(c, "empty", "No event plans found", nil)
	}

	return utils.RespApi(c, "ok", "Event plans retrieved successfully", eventPlans)
}

// GetFaqs returns all FAQs
func (h *WebProfileHandler) GetFaqs(c *fiber.Ctx) error {
	var faqs []models.Faq

	result := h.DB.Find(&faqs)
	if result.Error != nil {
		return utils.RespApi(c, "ise", "Failed to fetch FAQs", nil)
	}

	if len(faqs) == 0 {
		return utils.RespApi(c, "empty", "No FAQs found", nil)
	}

	return utils.RespApi(c, "ok", "FAQs retrieved successfully", faqs)
}

// GetSetting returns a specific setting by key
func (h *WebProfileHandler) GetSetting(c *fiber.Ctx) error {
	key := c.Params("key")

	var setting models.Setting

	result := h.DB.Where("set_key = ?", key).First(&setting)
	if result.Error != nil {
	if result.Error == gorm.ErrRecordNotFound {
			return utils.RespApi(c, "empty", "Setting not found", nil)
		}
		return utils.RespApi(c, "ise", "Failed to fetch setting", nil)
	}

	return utils.RespApi(c, "ok", "Setting retrieved successfully", setting)
}
