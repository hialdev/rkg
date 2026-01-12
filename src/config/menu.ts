// Define the menu item type
export interface MenuItem {
   name: string;
   path: string;
   childerns: MenuItem[];
}

export const menuPaths = {
   home: "/",
   about: "/about",
   gallery: "/gallery",
   service: {
      root: "/services",
      open_trip: "/services/open-trip",
      private_trip: "/services/private-trip",
      one_day_trip: "/services/one-day-trip",
      event_organizer: "/services/event-organizer",
   },
};
// This will be updated by the locale context to provide localized menu items
export const getMenus = (locale: "en" | "id"): MenuItem[] => {
   if (locale === "id") {
      return [
         { name: "Beranda", path: menuPaths.home, childerns: [] },
         { name: "Tentang Kami", path: menuPaths.about, childerns: [] },
         { name: "Galeri", path: menuPaths.gallery, childerns: [] },
         {
            name: "Layanan Kami",
            path: menuPaths.service.root,
            childerns: [
               {
                  name: "Open Trip",
                  path: menuPaths.service.open_trip,
                  childerns: [],
               },
               {
                  name: "Private Trip",
                  path: menuPaths.service.private_trip,
                  childerns: [],
               },
               {
                  name: "One Day Trip",
                  path: menuPaths.service.one_day_trip,
                  childerns: [],
               },
               {
                  name: "Event Organizer",
                  path: menuPaths.service.event_organizer,
                  childerns: [],
               },
            ],
         },
      ];
   } else {
      // English (default)
      return [
         { name: "Home", path: menuPaths.home, childerns: [] },
         { name: "About Us", path: menuPaths.about, childerns: [] },
         { name: "Gallery", path: menuPaths.gallery, childerns: [] },
         {
            name: "Our Services",
            path: menuPaths.service.root,
            childerns: [
               {
                  name: "Open Trip",
                  path: menuPaths.service.open_trip,
                  childerns: [],
               },
               {
                  name: "Private Trip",
                  path: menuPaths.service.private_trip,
                  childerns: [],
               },
               {
                  name: "One Day Trip",
                  path: menuPaths.service.one_day_trip,
                  childerns: [],
               },
               {
                  name: "Event Organizer",
                  path: menuPaths.service.event_organizer,
                  childerns: [],
               },
            ],
         },
      ];
   }
};

// Default menu for static rendering (will be updated on client side)
export const menus: MenuItem[] = [
   { name: "Home", path: menuPaths.home, childerns: [] },
   { name: "About Us", path: menuPaths.about, childerns: [] },
   { name: "Gallery", path: menuPaths.gallery, childerns: [] },
   {
      name: "Our Services",
      path: menuPaths.service.root,
      childerns: [
         {
            name: "Open Trip",
            path: menuPaths.service.open_trip,
            childerns: [],
         },
         {
            name: "Private Trip",
            path: menuPaths.service.private_trip,
            childerns: [],
         },
         {
            name: "One Day Trip",
            path: menuPaths.service.one_day_trip,
            childerns: [],
         },
         {
            name: "Event Organizer",
            path: menuPaths.service.event_organizer,
            childerns: [],
         },
      ],
   },
];
