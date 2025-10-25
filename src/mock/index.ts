export const cities = [
   {
      name: "Bali",
      province: "Bali",
      description:
         "Pulau dewata yang terkenal dengan pantai, gunung, dan budaya uniknya seperti Uluwatu, Kintamani, dan Ubud.",
   },
   {
      name: "Yogyakarta",
      province: "Daerah Istimewa Yogyakarta",
      description:
         "Dikenal dengan alam vulkanik Gunung Merapi, gua Jomblang, dan pantai-pantai selatan seperti Parangtritis.",
   },
   {
      name: "Bandung",
      province: "Jawa Barat",
      description:
         "Kota sejuk dengan wisata alam Lembang, Kawah Putih, dan kebun teh Ciwidey.",
   },
   {
      name: "Malang",
      province: "Jawa Timur",
      description:
         "Berada di dataran tinggi, terkenal dengan Batu, Coban Rondo, dan Bromo.",
   },
   {
      name: "Lombok",
      province: "Nusa Tenggara Barat",
      description:
         "Pulau dengan pantai eksotis seperti Kuta Mandalika dan Gunung Rinjani yang megah.",
   },
   {
      name: "Labuan Bajo",
      province: "Nusa Tenggara Timur",
      description:
         "Gerbang menuju Taman Nasional Komodo dengan pemandangan pulau dan laut biru yang menakjubkan.",
   },
   {
      name: "Manado",
      province: "Sulawesi Utara",
      description:
         "Tersohor dengan taman laut Bunaken dan wisata alam pegunungan Tomohon.",
   },
   {
      name: "Bukittinggi",
      province: "Sumatera Barat",
      description:
         "Kota bersejarah dengan keindahan Ngarai Sianok dan panorama Gunung Singgalang.",
   },
   {
      name: "Padang",
      province: "Sumatera Barat",
      description:
         "Selain kulinernya, Padang memiliki wisata pantai dan perbukitan seperti Air Manis dan Mandeh.",
   },
   {
      name: "Banyuwangi",
      province: "Jawa Timur",
      description:
         "Dijuluki The Sunrise of Java, terkenal dengan Kawah Ijen dan Pantai Pulau Merah.",
   },
   {
      name: "Wakatobi",
      province: "Sulawesi Tenggara",
      description:
         "Surga bawah laut dunia dengan keanekaragaman terumbu karang yang luar biasa.",
   },
   {
      name: "Raja Ampat",
      province: "Papua Barat Daya",
      description:
         "Salah satu destinasi diving terbaik dunia dengan gugusan pulau karst dan laut jernih.",
   },
   {
      name: "Bogor",
      province: "Jawa Barat",
      description:
         "Kota hujan yang dikelilingi wisata alam seperti Puncak, Curug Nangka, dan Kebun Raya Bogor.",
   },
   {
      name: "Dieng",
      province: "Jawa Tengah",
      description:
         "Dataran tinggi eksotis dengan kawah vulkanik, telaga warna, dan budaya khas pegunungan.",
   },
   {
      name: "Belitung",
      province: "Kepulauan Bangka Belitung",
      description:
         "Pulau dengan pantai batu granit raksasa dan laut biru toska yang jernih.",
   },
   {
      name: "Medan",
      province: "Sumatera Utara",
      description:
         "Gerbang menuju Danau Toba dan Pulau Samosir, wisata alam vulkanik terbesar di Asia Tenggara.",
   },
   {
      name: "Makassar",
      province: "Sulawesi Selatan",
      description:
         "Dekat dengan Taman Nasional Bantimurung, Pantai Losari, dan pegunungan Malino.",
   },
   {
      name: "Toba",
      province: "Sumatera Utara",
      description:
         "Area sekitar Danau Toba yang indah dengan budaya Batak dan pemandangan alam spektakuler.",
   },
   {
      name: "Flores",
      province: "Nusa Tenggara Timur",
      description:
         "Pulau dengan keajaiban alam seperti Danau Kelimutu, pantai pink, dan perbukitan hijau.",
   },
   {
      name: "Bromo",
      province: "Jawa Timur",
      description:
         "Gunung aktif dengan panorama lautan pasir dan sunrise paling ikonik di Indonesia.",
   },
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

export const tripTypes = [
   {
      name: "open-trip",
      label: "Open Trip",
   },
   {
      name: "private-trip",
      label: "Private Trip",
   },
];

export const openTrips = [
   {
      id: 1,
      title: "Open Trip Bali Adventure",
      destination: "Bali, Indonesia",
      duration: "5 Days 4 Nights",
      price: 2599000,
      image: imageLists[0],
   },
   {
      id: 2,
      title: "Sailing Komodo Island",
      destination: "Labuan Bajo, Indonesia",
      duration: "4 Days 3 Nights",
      price: 3299000,
      image: imageLists[1],
   },
   {
      id: 3,
      title: "Raja Ampat Explorer",
      destination: "Raja Ampat, Indonesia",
      duration: "6 Days 5 Nights",
      price: 4899000,
      image: imageLists[2],
   },
   {
      id: 4,
      title: "Bromo Sunrise Journey",
      destination: "Bromo, Indonesia",
      duration: "3 Days 2 Nights",
      price: 1899000,
      image: imageLists[1],
   },
   {
      id: 5,
      title: "Yogyakarta Heritage Tour",
      destination: "Yogyakarta, Indonesia",
      duration: "4 Days 3 Nights",
      price: 2199000,
      image: imageLists[2],
   },
   {
      id: 6,
      title: "Nusa Penida Getaway",
      destination: "Nusa Penida, Indonesia",
      duration: "3 Days 2 Nights",
      price: 1999000,
      image: imageLists[0],
   },
   {
      id: 7,
      title: "Belitung Island Escape",
      destination: "Belitung, Indonesia",
      duration: "4 Days 3 Nights",
      price: 2399000,
      image: imageLists[1],
   },
   {
      id: 8,
      title: "Lombok Paradise Tour",
      destination: "Lombok, Indonesia",
      duration: "5 Days 4 Nights",
      price: 2699000,
      image: imageLists[2],
   },
   {
      id: 9,
      title: "Derawan Marine Adventure",
      destination: "Derawan, Indonesia",
      duration: "6 Days 5 Nights",
      price: 4599000,
      image: imageLists[0],
   },
   {
      id: 10,
      title: "Sumba Hidden Gems",
      destination: "Sumba, Indonesia",
      duration: "5 Days 4 Nights",
      price: 3799000,
      image: imageLists[2],
   },
   {
      id: 11,
      title: "Flores Culture Expedition",
      destination: "Flores, Indonesia",
      duration: "6 Days 5 Nights",
      price: 3999000,
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
      image: "https://api.dicebear.com/7.x/notionists/png?seed=dmytro&size=300",
   },
   {
      id: 2,
      name: "Sarah Wijaya",
      role: "Project Manager",
      about: "Mengkoordinasikan pelaksanaan event dari awal sampai akhir dengan presisi dan kepuasan klien tinggi.",
      image: "https://api.dicebear.com/7.x/notionists/png?seed=sarahwijaya&size=300",
   },
   {
      id: 3,
      name: "Hadi Pratama",
      role: "Creative Director",
      about: "Menciptakan konsep visual yang unik dan berkesan, menjadikan setiap acara memiliki ciri khas tersendiri.",
      image: "https://api.dicebear.com/7.x/notionists/png?seed=hadipratama&size=300",
   },
   {
      id: 4,
      name: "Maria Gabriella",
      role: "Event Coordinator",
      about: "Gesit dan komunikatif, memastikan setiap elemen acara berjalan sesuai rencana tanpa hambatan.",
      image: "https://api.dicebear.com/7.x/notionists/png?seed=mariagabi&size=300",
   },
   {
      id: 5,
      name: "Kevin Santoso",
      role: "Technical Specialist",
      about: "Mengatur sistem audio, lighting, dan multimedia dengan profesional untuk pengalaman acara yang memukau.",
      image: "https://api.dicebear.com/7.x/notionists/png?seed=kevinsantoso&size=300",
   },
   {
      id: 6,
      name: "Chelsea Putri",
      role: "Marketing Strategist",
      about: "Mengembangkan kampanye promosi yang tepat sasaran dan meningkatkan awareness untuk setiap event.",
      image: "https://api.dicebear.com/7.x/notionists/png?seed=chelseaputri&size=300",
   },
   {
      id: 7,
      name: "Ardi Nugraha",
      role: "Logistic Manager",
      about: "Ahli dalam mengelola logistik agar event berjalan efisien — tepat waktu dan tepat lokasi.",
      image: "https://api.dicebear.com/7.x/notionists/png?seedardinugraha&size=300",
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
