// Define the menu item type
export interface MenuItem {
   name: string;
   path: string;
   childerns: MenuItem[];
}

// This will be updated by the locale context to provide localized menu items
export const getMenus = (locale: "en" | "id"): MenuItem[] => {
   if (locale === "id") {
      return [
         { name: "Beranda", path: "/", childerns: [] },
         { name: "Tentang Kami", path: "/about", childerns: [] },
         { name: "Galeri", path: "/gallery", childerns: [] },
         {
            name: "Layanan Kami",
            path: "/services",
            childerns: [
               {
                  name: "Open Trip",
                  path: "/search?cities=&tripType=open-trip",
                  childerns: [],
               },
               {
                  name: "Private Trip",
                  path: "/search?cities=&tripType=private-trip",
                  childerns: [],
               },
               {
                  name: "Event Organizer",
                  path: "/event-organizer",
                  childerns: [],
               },
            ],
         },
      ];
   } else {
      // English (default)
      return [
         { name: "Home", path: "/", childerns: [] },
         { name: "About Us", path: "/about", childerns: [] },
         { name: "Gallery", path: "/gallery", childerns: [] },
         {
            name: "Our Services",
            path: "/services",
            childerns: [
               {
                  name: "Open Trip",
                  path: "/search?cities=&tripType=open-trip",
                  childerns: [],
               },
               {
                  name: "Private Trip",
                  path: "/search?cities=&tripType=private-trip",
                  childerns: [],
               },
               {
                  name: "Event Organizer",
                  path: "/event-organizer",
                  childerns: [],
               },
            ],
         },
      ];
   }
};

// Default menu for static rendering (will be updated on client side)
export const menus: MenuItem[] = [
   { name: "Home", path: "/", childerns: [] },
   { name: "About Us", path: "/about", childerns: [] },
   { name: "Gallery", path: "/gallery", childerns: [] },
   {
      name: "Our Services",
      path: "/services",
      childerns: [
         {
            name: "Open Trip",
            path: "/search?cities=&tripType=open-trip",
            childerns: [],
         },
         {
            name: "Private Trip",
            path: "/search?cities=&tripType=private-trip",
            childerns: [],
         },
         { name: "Event Organizer", path: "/event-organizer", childerns: [] },
      ],
   },
];
