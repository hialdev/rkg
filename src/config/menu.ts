export const menus = [
   { name: "Home", path: "/home", childerns: [] },
   { name: "About Us", path: "/about", childerns: [] },
   { name: "Gallery", path: "/gallery", childerns: [] },
   {
      name: "Our Services",
      path: "/services",
      childerns: [
         {
            name: "Open Trip",
            path: "/open-trip",
            childerns: [],
         },
         {
            name: "Private Trip",
            path: "/private-trip",
            childerns: [
               { name: "VIP Package", path: "/vip-package", childerns: [] },
               {
                  name: "Family Package",
                  path: "/family-package",
                  childerns: [],
               },
            ],
         },
         { name: "Event Organizer", path: "/event-organizer", childerns: [] },
      ],
   },
];