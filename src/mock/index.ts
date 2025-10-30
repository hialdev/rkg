export const countries = [
   { id: 1, name: "Indonesia" },
   { id: 2, name: "Malaysia" },
];

export const cities = [
   {
      id: 1,
      country_id: 1,
      name: "Bali",
      province: "Bali",
      description:
         "Pulau dewata yang terkenal dengan pantai, gunung, dan budaya unik.",
   },
   {
      id: 2,
      country_id: 1,
      name: "Yogyakarta",
      province: "DIY",
      description: "Dikenal dengan Gunung Merapi, candi, dan pantai selatan.",
   },
   {
      id: 3,
      country_id: 1,
      name: "Bandung",
      province: "Jawa Barat",
      description: "Kota sejuk dengan wisata alam Lembang dan Ciwidey.",
   },
   {
      id: 4,
      country_id: 1,
      name: "Labuan Bajo",
      province: "NTT",
      description: "Gerbang menuju Taman Nasional Komodo dan pulau eksotis.",
   },
   {
      id: 5,
      country_id: 1,
      name: "Lombok",
      province: "NTB",
      description:
         "Pulau dengan pantai eksotis seperti Kuta Mandalika dan Gunung Rinjani.",
   },
   {
      id: 6,
      country_id: 1,
      name: "Bromo",
      province: "Jawa Timur",
      description:
         "Gunung aktif dengan panorama lautan pasir dan sunrise ikonik.",
   },
   {
      id: 7,
      country_id: 1,
      name: "Makassar",
      province: "Sulawesi Selatan",
      description: "Dekat dengan Taman Nasional Bantimurung dan Pantai Losari.",
   },
   {
      id: 8,
      country_id: 1,
      name: "Medan",
      province: "Sumatera Utara",
      description: "Gerbang menuju Danau Toba dan Pulau Samosir.",
   },
   {
      id: 9,
      country_id: 1,
      name: "Padang",
      province: "Sumatera Barat",
      description: "Kota dengan kuliner khas dan pantai indah.",
   },
   {
      id: 10,
      country_id: 1,
      name: "Raja Ampat",
      province: "Papua Barat Daya",
      description:
         "Destinasi diving terbaik dunia dengan pulau karst dan laut biru.",
   },
   {
      id: 11,
      country_id: 2,
      name: "Kuala Lumpur",
      province: "Wilayah Persekutuan",
      description: "Ibukota Malaysia dengan landmark Menara Kembar Petronas.",
   },
   {
      id: 12,
      country_id: 2,
      name: "Penang",
      province: "Pulau Pinang",
      description: "Kota heritage dengan kuliner dan pantai indah.",
   },
];

export const tripTypes = [
   { name: "open-trip", label: "Open Trip" },
   { name: "private-trip", label: "Private Trip" },
];

export const imageLists = [
   {
      path: "https://akcdn.detik.net.id/visual/2025/06/10/fakta-menarik-raja-ampat-foto-unsplashcomsimon-spring-1749562020339_169.png?w=1200&q=90",
      alt: "Raja Ampat 1",
   },
   {
      path: "https://indonesiajuara.asia/wp-content/uploads/2023/11/raja-ampat_11zon.webp",
      alt: "Raja Ampat 2",
   },
   {
      path: "https://www.oasisrajaampat.com/wp-content/uploads/2024/08/Surga-Bawah-Laut-Raja-Ampat.jpg",
      alt: "Raja Ampat 3",
   },
];

export const openTrips = [
   {
      id: 1,
      title: "Bali Adventure",
      city_id: 1,
      type: "open-trip",
      duration: "5D4N",
      price: 2599000,
      image: imageLists[0],
   },
   {
      id: 2,
      title: "Yogyakarta Heritage Tour",
      city_id: 2,
      type: "private-trip",
      duration: "4D3N",
      price: 2199000,
      image: imageLists[1],
   },
   {
      id: 3,
      title: "Bandung Leisure Trip",
      city_id: 3,
      type: "open-trip",
      duration: "3D2N",
      price: 1899000,
      image: imageLists[2],
   },
   {
      id: 4,
      title: "Labuan Bajo Sailing",
      city_id: 4,
      type: "private-trip",
      duration: "4D3N",
      price: 3299000,
      image: imageLists[0],
   },
   {
      id: 5,
      title: "Lombok Paradise Tour",
      city_id: 5,
      type: "open-trip",
      duration: "5D4N",
      price: 2699000,
      image: imageLists[1],
   },
   {
      id: 6,
      title: "Bromo Sunrise Journey",
      city_id: 6,
      type: "open-trip",
      duration: "3D2N",
      price: 1899000,
      image: imageLists[2],
   },
   {
      id: 7,
      title: "Makassar Island Escape",
      city_id: 7,
      type: "private-trip",
      duration: "4D3N",
      price: 2399000,
      image: imageLists[1],
   },
   {
      id: 8,
      title: "Medan Culture Expedition",
      city_id: 8,
      type: "open-trip",
      duration: "6D5N",
      price: 3999000,
      image: imageLists[0],
   },
   {
      id: 9,
      title: "Padang Culinary Tour",
      city_id: 9,
      type: "private-trip",
      duration: "3D2N",
      price: 1999000,
      image: imageLists[2],
   },
   {
      id: 10,
      title: "Raja Ampat Diving",
      city_id: 10,
      type: "open-trip",
      duration: "6D5N",
      price: 4899000,
      image: imageLists[0],
   },
   {
      id: 11,
      title: "Kuala Lumpur City Tour",
      city_id: 11,
      type: "private-trip",
      duration: "3D2N",
      price: 1799000,
      image: imageLists[1],
   },
];

export const events = [
   {
      id: 1,
      title: "Open Trip Komodo Exclusive 2025",
      excerpt:
         "Nikmati pengalaman berlayar 3 hari 2 malam di Labuan Bajo bersama trip organizer profesional dengan fasilitas premium.",
      company: "PT Nusantara Explore Indonesia",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
      created_at: "2025-09-30T09:00:00Z",
   },
   {
      id: 2,
      title: "Private Trip Lombok Paradise",
      excerpt:
         "Jelajahi pantai-pantai indah di Lombok dengan itinerary eksklusif yang bisa disesuaikan dengan kebutuhanmu.",
      company: "PT Lombok Adventure Tour",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
      created_at: "2025-10-02T10:15:00Z",
   },
   {
      id: 3,
      title: "Camping Ranu Kumbolo Experience",
      excerpt:
         "Pendakian seru menuju Ranu Kumbolo dengan pemandu berpengalaman dan fasilitas lengkap untuk kenyamanan peserta.",
      company: "PT Summit Outdoor Indonesia",
      image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1000&q=80",
      created_at: "2025-10-05T06:45:00Z",
   },
   {
      id: 4,
      title: "Explore Bali Hidden Gems",
      excerpt:
         "Temukan sisi lain Pulau Dewata lewat trip eksklusif ke air terjun tersembunyi dan desa tradisional Bali.",
      company: "PT Bali Journey Experience",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80",
      created_at: "2025-10-08T11:30:00Z",
   },
   {
      id: 5,
      title: "Desert Adventure Bromo Sunrise",
      excerpt:
         "Saksikan keindahan sunrise dari puncak Bromo dengan fasilitas jeep tour dan sarapan khas Tengger.",
      company: "PT Java Trails Tour & Travel",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=80",
      created_at: "2025-10-10T04:20:00Z",
   },
   {
      id: 6,
      title: "Sailing Raja Ampat Expedition",
      excerpt:
         "Perjalanan eksklusif ke surga bawah laut Raja Ampat, dengan kapal phinisi mewah dan instruktur diving profesional.",
      company: "PT Oceanic Voyage Nusantara",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
      created_at: "2025-10-12T09:00:00Z",
   },
   {
      id: 7,
      title: "Cultural Trip Yogyakarta Heritage",
      excerpt:
         "Eksplorasi budaya Jawa melalui kunjungan ke Keraton, batik workshop, dan wisata kuliner khas Yogyakarta.",
      company: "PT Java Culture Experience",
      image: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=1000&q=80",
      created_at: "2025-10-15T08:00:00Z",
   },
];

export const eventTypes = [
   {
      id: 1,
      title: "MICE",
      icon_id: "mdi:briefcase-outline",
   },
   {
      id: 2,
      title: "Event",
      icon_id: "mdi:calendar-star",
   },
   {
      id: 3,
      title: "Entertainment",
      icon_id: "mdi:music-circle-outline",
   },
   {
      id: 4,
      title: "Team Building",
      icon_id: "mdi:account-group-outline",
   },
];

export const eventStats = [
   {
      id: 1,
      title: "Projects Done",
      icon_id: "mdi:clipboard-check-multiple-outline",
      count: 1000,
      unit_count: "+",
   },
   {
      id: 2,
      title: "Satisfactory Rate",
      icon_id: "mdi:thumb-up-outline",
      count: 98,
      unit_count: "%",
   },
   {
      id: 3,
      title: "Team Expert",
      icon_id: "mdi:account-tie-outline",
      count: 99,
      unit_count: "+",
   },
   {
      id: 4,
      title: "Customer Happy",
      icon_id: "mdi:emoticon-happy-outline",
      count: 1000,
      unit_count: "+",
   },
];

export const teams = [
   {
      id: 1,
      name: "Dmytro Zabolotnyi",
      role: "Founder",
      about: "Berpengalaman lebih dari 10 tahun membangun brand event besar dan mengelola tim profesional di banyak kota.",
      image: "https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=900",
   },
   {
      id: 2,
      name: "Sarah Wijaya",
      role: "Project Manager",
      about: "Mengkoordinasikan pelaksanaan event dari awal sampai akhir dengan presisi dan kepuasan klien tinggi.",
      image: "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=900",
   },
   {
      id: 3,
      name: "Hadi Pratama",
      role: "Creative Director",
      about: "Menciptakan konsep visual yang unik dan berkesan, menjadikan setiap acara memiliki ciri khas tersendiri.",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=900",
   },
   {
      id: 4,
      name: "Maria Gabriella",
      role: "Event Coordinator",
      about: "Gesit dan komunikatif, memastikan setiap elemen acara berjalan sesuai rencana tanpa hambatan.",
      image: "https://plus.unsplash.com/premium_photo-1670884441012-c5cf195c062a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=900",
   },
   {
      id: 5,
      name: "Kevin Santoso",
      role: "Technical Specialist",
      about: "Mengatur sistem audio, lighting, dan multimedia dengan profesional untuk pengalaman acara yang memukau.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=900",
   },
   {
      id: 6,
      name: "Chelsea Putri",
      role: "Marketing Strategist",
      about: "Mengembangkan kampanye promosi yang tepat sasaran dan meningkatkan awareness untuk setiap event.",
      image: "https://images.unsplash.com/photo-1701615004837-40d8573b6652?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=900",
   },
   {
      id: 7,
      name: "Ardi Nugraha",
      role: "Logistic Manager",
      about: "Ahli dalam mengelola logistik agar event berjalan efisien — tepat waktu dan tepat lokasi.",
      image: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=900",
   },
];

export const clients = [
   {
      id: 1,
      name: "EventCom",
      logo: "https://cdn.simpleicons.org/perplexity",
   },
   {
      id: 2,
      name: "StarLight Productions",
      logo: "https://cdn.simpleicons.org/starbucks",
   },
   {
      id: 3,
      name: "MiceWorks Group",
      logo: "https://cdn.simpleicons.org/cnn",
   },
   {
      id: 4,
      name: "CreativePulse Agency",
      logo: "https://cdn.simpleicons.org/slack",
   },
   {
      id: 5,
      name: "TeamFusion Indonesia",
      logo: "https://cdn.simpleicons.org/samsung",
   },
   {
      id: 6,
      name: "EntertainUs",
      logo: "https://cdn.simpleicons.org/netflix",
   },
   {
      id: 7,
      name: "Mega Organizer",
      logo: "https://cdn.simpleicons.org/spotify",
   },
   {
      id: 8,
      name: "Harmony Events",
      logo: "https://cdn.simpleicons.org/zoom",
   },
];

export const testimonials = [
   {
      id: 1,
      name: "Budi Santoso",
      quote: "Pelayanan sangat profesional dan hasilnya memuaskan! Akan bekerja sama lagi.",
      from_name: "Google Review",
      from_logo: "https://cdn.simpleicons.org/google",
      stars: 5,
      created_at: "2024-09-12T10:20:00Z",
   },
   {
      id: 2,
      name: "Siti Rahma",
      quote: "Tim yang sangat komunikatif dan pengerjaan tepat waktu.",
      from_name: "Tiktok",
      from_logo: "https://cdn.simpleicons.org/tiktok",
      stars: 4,
      created_at: "2024-10-01T08:45:00Z",
   },
   {
      id: 3,
      name: "Michael Thompson",
      quote: "Good collaboration and fast response. Recommended!",
      from_name: "Upwork",
      from_logo: "https://cdn.simpleicons.org/upwork",
      stars: 5,
      created_at: "2024-07-20T16:00:00Z",
   },
   {
      id: 4,
      name: "Nurul Afifah",
      quote: "Hasilnya bagus, walaupun revisi agak lama tapi tetap memuaskan.",
      from_name: "Google Review",
      from_logo: "https://cdn.simpleicons.org/google",
      stars: 4,
      created_at: "2024-08-10T12:30:00Z",
   },
   {
      id: 5,
      name: "Jonathan Lee",
      quote: "Very talented team! Creative and detail-oriented.",
      from_name: "Behance",
      from_logo: "https://cdn.simpleicons.org/behance",
      stars: 5,
      created_at: "2024-06-05T09:10:00Z",
   },
   {
      id: 6,
      name: "Andi Wijaya",
      quote: "Cukup baik untuk project kecil kami.",
      from_name: "LinkedIn",
      from_logo: "https://cdn.simpleicons.org/linkedin",
      stars: 3,
      created_at: "2024-05-18T11:00:00Z",
   },
   {
      id: 7,
      name: "Akira Tanaka",
      quote: "Excellent work and friendly support!",
      from_name: "Fiverr",
      from_logo: "https://cdn.simpleicons.org/fiverr",
      stars: 5,
      created_at: "2024-09-22T14:40:00Z",
   },
];

export const galleries = [
   {
      id: 1,
      media: imageLists[0].path,
      title: "Pendakian Gunung Rinjani",
      excerpt: "Menikmati pemandangan Danau Segara Anak yang spektakuler.",
      type: "image" as const,
   },
   {
      id: 2,
      media: imageLists[1].path,
      title: "Sunset di Pantai Kuta",
      excerpt: "Ceria bersama teman sambil menikmati senja di pasir putih.",
      type: "image" as const,
   },
   {
      id: 3,
      media: imageLists[2].path,
      title: "Eksplorasi Candi Borobudur",
      excerpt: "Belajar sejarah sambil mengambil foto menawan.",
      type: "image" as const,
   },
   {
      id: 4,
      media: imageLists[0].path,
      title: "Petualangan Pulau Komodo",
      excerpt: "Menyaksikan komodo dan snorkeling di perairan jernih.",
      type: "image" as const,
   },
   {
      id: 5,
      media: imageLists[2].path,
      title: "Terasering Sawah Ubud",
      excerpt: "Pemandangan hijau yang menenangkan jiwa, sempurna untuk foto.",
      type: "image" as const,
   },
   {
      id: 6,
      media: imageLists[0].path,
      title: "Camping di Hutan Bali",
      excerpt:
         "Malam penuh bintang, api unggun, dan cerita seru bersama teman.",
      type: "image" as const,
   },
   {
      id: 7,
      media: imageLists[1].path,
      title: "Snorkeling di Nusa Penida",
      excerpt: "Menyelam dan melihat ikan tropis yang indah.",
      type: "image" as const,
   },
];

export const galleryItems = [
   {
      id: 1,
      media: imageLists[0].path,
      title: "Pendakian Gunung Rinjani",
      excerpt: "Menikmati pemandangan Danau Segara Anak yang spektakuler.",
      type: "image" as const,
   },
   {
      id: 2,
      media: imageLists[1].path,
      title: "Sunset di Pantai Kuta",
      excerpt: "Ceria bersama teman sambil menikmati senja di pasir putih.",
      type: "image" as const,
   },
   {
      id: 3,
      media: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      title: "Keindahan Alam Indonesia",
      excerpt: "Video dokumenter tentang keindahan alam Indonesia.",
      type: "video" as const,
   },
   {
      id: 4,
      media: imageLists[2].path,
      title: "Eksplorasi Candi Borobudur",
      excerpt: "Belajar sejarah sambil mengambil foto menawan.",
      type: "image" as const,
   },
   {
      id: 5,
      media: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      title: "Petualangan Hewan Liar",
      excerpt: "Video dokumenter tentang kehidupan hewan liar di Indonesia.",
      type: "video" as const,
   },
   {
      id: 6,
      media: imageLists[0].path,
      title: "Petualangan Pulau Komodo",
      excerpt: "Menyaksikan komodo dan snorkeling di perairan jernih.",
      type: "image" as const,
   },
   {
      id: 7,
      media: imageLists[2].path,
      title: "Terasering Sawah Ubud",
      excerpt: "Pemandangan hijau yang menenangkan jiwa, sempurna untuk foto.",
      type: "image" as const,
   },
   {
      id: 8,
      media: imageLists[0].path,
      title: "Camping di Hutan Bali",
      excerpt:
         "Malam penuh bintang, api unggun, dan cerita seru bersama teman.",
      type: "image" as const,
   },
   {
      id: 9,
      media: imageLists[1].path,
      title: "Snorkeling di Nusa Penida",
      excerpt: "Menyelam dan melihat ikan tropis yang indah.",
      type: "image" as const,
   },
   {
      id: 10,
      media: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      title: "Api dan Es di Indonesia",
      excerpt: "Perpaduan unik antara gunung berapi dan danau es di Indonesia.",
      type: "video" as const,
   },
];

export const highlights = [
   {
      icon: "twemoji:world-map",
      title: "Destinasi Terbaik",
      description:
         "Destinasi wisata alam terbaik Indonesia untuk pengalaman terbaik anda",
   },
   {
      icon: "emojione-v1:person-surfing",
      title: "Aktivitas Seru",
      description: "Beragam aktivitas menarik dan menantang untuk semua usia",
   },
   {
      icon: "emojione-v1:pot-of-food",
      title: "Kuliner Lokal",
      description:
         "Nikmati cita rasa khas daerah dengan makanan dan minuman lokal",
   },
   {
      icon: "fxemoji:camerawithflash",
      title: "Foto Instagramable",
      description: "Spot foto terbaik yang membuat setiap momen berkesan",
   },
   {
      icon: "emojione-v1:beach-with-umbrella",
      title: "Akomodasi Nyaman",
      description: "Pilihan penginapan strategis dan nyaman selama perjalanan",
   },
   {
      icon: "emojione-v1:flying-envelope",
      title: "Booking Cepat",
      description: "Pesan perjalanan Anda dalam hitungan menit tanpa ribet",
   },
];
