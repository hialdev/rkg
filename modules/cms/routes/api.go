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

	trips := handlers.NewTripHandler(db)
	trip := api.Group("/trips")
	trip.Use(middlewares.JWTProtected())
	trip.Use(middlewares.DoACL("Read Trip")).Get("/", trips.GetAllTrips)
	trip.Use(middlewares.DoACL("Read Trip")).Get("/:id", trips.GetTrip)
	trip.Use(middlewares.DoACL("Add Trip")).Post("/", trips.AddTrip)
	trip.Use(middlewares.DoACL("Update Trip")).Post("/:id", trips.UpdateTrip)
	trip.Use(middlewares.DoACL("Delete Trip")).Delete("/:id", trips.DeleteTrip)

	destinations := handlers.NewDestinationHandler(db)
	destination := api.Group("/destinations")
	destination.Use(middlewares.JWTProtected())
	destination.Use(middlewares.DoACL("Read Destination")).Get("/", destinations.GetAllDestinations)
	destination.Use(middlewares.DoACL("Read Destination")).Get("/:id", destinations.GetDestination)
	destination.Use(middlewares.DoACL("Add Destination", "Add Trip")).Post("/", destinations.AddDestination)
	destination.Use(middlewares.DoACL("Update Destination")).Post("/:id", destinations.UpdateDestination)
	destination.Use(middlewares.DoACL("Delete Destination")).Delete("/:id", destinations.DeleteDestination)

	events := handlers.NewEventHandler(db)
	event := api.Group("/events")
	event.Use(middlewares.JWTProtected())
	event.Use(middlewares.DoACL("Read Event")).Get("/", events.GetAllEvents)
	event.Use(middlewares.DoACL("Read Event")).Get("/:id", events.GetEvent)
	event.Use(middlewares.DoACL("Add Event")).Post("/", events.AddEvent)
	event.Use(middlewares.DoACL("Update Event")).Post("/:id", events.UpdateEvent)
	event.Use(middlewares.DoACL("Delete Event")).Delete("/:id", events.DeleteEvent)

	teams := handlers.NewTeamHandler(db)
	team := api.Group("/teams")
	team.Use(middlewares.JWTProtected())
	team.Use(middlewares.DoACL("Read Team")).Get("/", teams.GetAllTeams)
	team.Use(middlewares.DoACL("Read Team")).Get("/:id", teams.GetTeam)
	team.Use(middlewares.DoACL("Add Team")).Post("/", teams.AddTeam)
	team.Use(middlewares.DoACL("Update Team")).Post("/:id", teams.UpdateTeam)
	team.Use(middlewares.DoACL("Delete Team")).Delete("/:id", teams.DeleteTeam)

	// Event Types routes
	eventTypes := handlers.NewEventTypeHandler(db)
	eventType := api.Group("/event-types")
	eventType.Use(middlewares.JWTProtected())
	eventType.Use(middlewares.DoACL("Read EventType")).Get("/", eventTypes.GetAllEventTypes)
	eventType.Use(middlewares.DoACL("Read EventType")).Get("/:id", eventTypes.GetEventType)
	eventType.Use(middlewares.DoACL("Add EventType")).Post("/", eventTypes.AddEventType)
	eventType.Use(middlewares.DoACL("Update EventType")).Post("/:id", eventTypes.UpdateEventType)
	eventType.Use(middlewares.DoACL("Delete EventType")).Delete("/:id", eventTypes.DeleteEventType)

	// Event Plans routes
	eventPlans := handlers.NewEventPlanHandler(db)
	eventPlan := api.Group("/event-plans")
	eventPlan.Use(middlewares.JWTProtected())
	eventPlan.Use(middlewares.DoACL("Read EventPlan")).Get("/", eventPlans.GetAllEventPlans)
	eventPlan.Use(middlewares.DoACL("Read EventPlan")).Get("/:id", eventPlans.GetEventPlan)
	eventPlan.Use(middlewares.DoACL("Add EventPlan")).Post("/", eventPlans.AddEventPlan)
	eventPlan.Use(middlewares.DoACL("Update EventPlan")).Post("/:id", eventPlans.UpdateEventPlan)
	eventPlan.Use(middlewares.DoACL("Delete EventPlan")).Delete("/:id", eventPlans.DeleteEventPlan)

	// Event Services routes
	eventServices := handlers.NewEventServiceHandler(db)
	eventService := api.Group("/event-services")
	eventService.Use(middlewares.JWTProtected())
	eventService.Use(middlewares.DoACL("Read EventService")).Get("/", eventServices.GetAllEventServices)
	eventService.Use(middlewares.DoACL("Read EventService")).Get("/:id", eventServices.GetEventService)
	eventService.Use(middlewares.DoACL("Add EventService")).Post("/", eventServices.AddEventService)
	eventService.Use(middlewares.DoACL("Update EventService")).Post("/:id", eventServices.UpdateEventService)
	eventService.Use(middlewares.DoACL("Delete EventService")).Delete("/:id", eventServices.DeleteEventService)

	// Clients routes
	clients := handlers.NewClientHandler(db)
	client := api.Group("/clients")
	client.Use(middlewares.JWTProtected())
	client.Use(middlewares.DoACL("Read Client")).Get("/", clients.GetAllClients)
	client.Use(middlewares.DoACL("Read Client")).Get("/:id", clients.GetClient)
	client.Use(middlewares.DoACL("Add Client")).Post("/", clients.AddClient)
	client.Use(middlewares.DoACL("Update Client")).Post("/:id", clients.UpdateClient)
	client.Use(middlewares.DoACL("Delete Client")).Delete("/:id", clients.DeleteClient)

	// FAQs routes
	faqs := handlers.NewFaqHandler(db)
	faq := api.Group("/faqs")
	faq.Use(middlewares.JWTProtected())
	faq.Use(middlewares.DoACL("Read Faq")).Get("/", faqs.GetAllFaqs)
	faq.Use(middlewares.DoACL("Read Faq")).Get("/:id", faqs.GetFaq)
	faq.Use(middlewares.DoACL("Add Faq")).Post("/", faqs.AddFaq)
	faq.Use(middlewares.DoACL("Update Faq")).Post("/:id", faqs.UpdateFaq)
	faq.Use(middlewares.DoACL("Delete Faq")).Delete("/:id", faqs.DeleteFaq)

	// Testimonials routes
	testimonials := handlers.NewTestimonialHandler(db)
	testimonial := api.Group("/testimonials")
	testimonial.Use(middlewares.JWTProtected())
	testimonial.Use(middlewares.DoACL("Read Testimonial")).Get("/", testimonials.GetAllTestimonials)
	testimonial.Use(middlewares.DoACL("Read Testimonial")).Get("/:id", testimonials.GetTestimonial)
	testimonial.Use(middlewares.DoACL("Add Testimonial")).Post("/", testimonials.AddTestimonial)
	testimonial.Use(middlewares.DoACL("Update Testimonial")).Post("/:id", testimonials.UpdateTestimonial)
	testimonial.Use(middlewares.DoACL("Delete Testimonial")).Delete("/:id", testimonials.DeleteTestimonial)
}
