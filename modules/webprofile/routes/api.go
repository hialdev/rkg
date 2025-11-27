package routes

import (
	"aldev/modules/webprofile/handlers"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func WebProfileRoute(app fiber.Router, db *gorm.DB) {
	h := &handlers.WebProfileHandler{DB: db}

	// Locations
	app.Get("/api/web/locations", h.GetLocations)

	// Trips
	app.Get("/api/web/trips", h.GetTrips)
	app.Get("/api/web/trips/:slug", h.GetTrips)

	// Events
	app.Get("/api/web/events", h.GetEvents)
	app.Get("/api/web/events/:slug", h.GetEvents)

	// Testimonials
	app.Get("/api/web/testimonials", h.GetTestimonials)

	// Event Types
	app.Get("/api/web/event-types", h.GetEventTypes)
	app.Get("/api/web/event-types/:slug", h.GetEventTypes)

	// Teams
	app.Get("/api/web/teams", h.GetTeams)

	// Clients
	app.Get("/api/web/clients", h.GetClients)

	// Galleries
	app.Get("/api/web/galleries", h.GetGalleries)

	// Event Plans
	app.Get("/api/web/event-plans", h.GetEventPlans)

	// FAQs
	app.Get("/api/web/faqs", h.GetFaqs)
	
	// Settings
	app.Get("/api/web/setting/:key", h.GetSetting)
}
