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

export const airports = [
   {
      id: 1,
      name: "Ngurah Rai International Airport",
      code: "DPS",
      city_id: 1,
   },
   {
      id: 2,
      name: "Adisutjipto International Airport",
      code: "JOG",
      city_id: 2,
   },
   {
      id: 3,
      name: "Husein Sastranegara International Airport",
      code: "BDO",
      city_id: 3,
   },
   {
      id: 4,
      name: "Komodo Airport",
      code: "LBJ",
      city_id: 4,
   },
   {
      id: 5,
      name: "Lombok International Airport",
      code: "LOP",
      city_id: 5,
   },
   {
      id: 6,
      name: "Abdul Rachman Saleh Airport",
      code: "MLG",
      city_id: 6,
   },
   {
      id: 7,
      name: "Sultan Hasanuddin International Airport",
      code: "UPG",
      city_id: 7,
   },
   {
      id: 8,
      name: "Kualanamu International Airport",
      code: "KNO",
      city_id: 8,
   },
   {
      id: 9,
      name: "Minangkabau International Airport",
      code: "PDG",
      city_id: 9,
   },
   {
      id: 10,
      name: "Raja Ampat Airport",
      code: "RJM",
      city_id: 10,
   },
   {
      id: 11,
      name: "Kuala Lumpur International Airport",
      code: "KUL",
      city_id: 11,
   },
];

export const destinations = [
   // City 1 (Bali) - 5 destinasi
   {
      id: 1,
      image: imageLists[0].path,
      title: "Pantai Kuta",
      description:
         "Pasir putih dan spot sunset ikonik, cocok untuk bersantai dan surfing pemula.",
      city_id: 1,
   },
   {
      id: 2,
      image: imageLists[1].path,
      title: "Ubud Rice Terrace",
      description:
         "Terasering sawah hijau yang menenangkan dan populer untuk berfoto.",
      city_id: 1,
   },
   {
      id: 3,
      image: imageLists[2].path,
      title: "Tirta Empul",
      description:
         "Pura suci dengan mata air berkhasiat untuk upacara pembersihan spiritual.",
      city_id: 1,
   },
   {
      id: 4,
      image: imageLists[0].path,
      title: "Tanah Lot",
      description:
         "Pura di tepi laut dengan panorama matahari terbenam yang dramatis.",
      city_id: 1,
   },
   {
      id: 5,
      image: imageLists[1].path,
      title: "Monkey Forest",
      description:
         "Hutan suci berisi kera ekor panjang dan peninggalan budaya Bali.",
      city_id: 1,
   },

   // City 2 (Yogyakarta) - 3 destinasi
   {
      id: 6,
      image: imageLists[2].path,
      title: "Candi Prambanan",
      description:
         "Kompleks candi Hindu besar dengan arsitektur megah dan relief bersejarah.",
      city_id: 2,
   },
   {
      id: 7,
      image: imageLists[0].path,
      title: "Keraton Yogyakarta",
      description:
         "Istana Sultan yang tetap berfungsi sebagai pusat kebudayaan Jawa.",
      city_id: 2,
   },
   {
      id: 8,
      image: imageLists[1].path,
      title: "Bukit Bintang",
      description:
         "Puncak pandang malam dengan pemandangan kota Yogyakarta yang memukau.",
      city_id: 2,
   },

   // City 3 (Bandung) - 3 destinasi
   {
      id: 9,
      image: imageLists[0].path,
      title: "Tangkuban Perahu",
      description:
         "Gunung berapi dengan kawah yang mudah dijangkau dan pemandangan menakjubkan.",
      city_id: 3,
   },
   {
      id: 10,
      image: imageLists[2].path,
      title: "Kawah Putih",
      description: "Danau kawah berwarna unik di dataran tinggi Ciwidey.",
      city_id: 3,
   },
   {
      id: 11,
      image: imageLists[1].path,
      title: "Lembang Floating Market",
      description:
         "Pasar wisata kuliner dan cenderamata di tepi danau dan area pegunungan.",
      city_id: 3,
   },

   // City 4 (Labuan Bajo) - 3 destinasi
   {
      id: 12,
      image: imageLists[2].path,
      title: "Pulau Komodo",
      description:
         "Habitat asli komodo, destinasi wajib untuk melihat satwa purba ini.",
      city_id: 4,
   },
   {
      id: 13,
      image: imageLists[0].path,
      title: "Pink Beach",
      description:
         "Pantai berpasir merah muda dengan air jernih dan spot snorkeling yang bagus.",
      city_id: 4,
   },
   {
      id: 14,
      image: imageLists[1].path,
      title: "Manta Point",
      description:
         "Spot diving/snorkeling populer untuk menyaksikan ikan pari manta.",
      city_id: 4,
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
      from_name: "Line",
      from_logo: "https://cdn.simpleicons.org/line",
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

export const testiTrips = [
   {
      id: 1,
      trip_id: 1,
      name: "Lina Marlina",
      role: "Traveler",
      images: [
         "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
         "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80",
         "https://images.unsplash.com/photo-1682686580391-615b1f28e5ee?auto=format&fit=crop&w=800&q=80",
      ],
      review:
         "Perjalanan sangat menyenangkan: itinerary jelas, pemandu ramah, dan akomodasi sesuai harapan. Spot snorkeling dan pantainya luar biasa. Saya akan merekomendasikan trip ini ke teman yang suka petualangan santai.",
      star: 5,
   },
   {
      id: 2,
      trip_id: 2,
      name: "Ahmad Rizki",
      role: "Adventure Seeker",
      images: [
         "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
         "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=800&q=80",
      ],
      review:
         "Lokasi wisata dan guide oke, makanan lokal yang disediakan enak. Beberapa waktu transit agak lama tapi keseluruhan pengalaman memuaskan dan sebanding dengan harga.",
      star: 4,
   },
   {
      id: 3,
      trip_id: 3,
      name: "Sarah Chen",
      role: "Photography Enthusiast",
      images: [
         "https://images.unsplash.com/photo-1518890569493-668df9a00266?auto=format&fit=crop&w=800&q=80",
      ],
      review:
         "Tempat-tempatnya sangat fotogenik dan guide memberi banyak tips pemotretan. Transportasi nyaman namun ada satu spot yang sedikit ramai, tetap worth it untuk pencinta foto.",
      star: 5,
   },
   {
      id: 4,
      trip_id: 4,
      name: "Michael Wong",
      role: "Nature Explorer",
      images: [
         "https://images.unsplash.com/photo-1502791451862-7bd8c1df43a7?auto=format&fit=crop&w=800&q=80",
         "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=800&q=80",
      ],
      review:
         "Pengalaman alam yang menyenangkan dengan pemandu berpengalaman. Akomodasi sederhana tapi bersih. Sedikit terasa padat pada hari kedua, namun overall puas dengan layanan.",
      star: 4,
   },
   {
      id: 5,
      trip_id: 5,
      name: "Diana Putri",
      role: "Beach Lover",
      images: [
         "https://images.unsplash.com/photo-1520942702018-0862200e6873?auto=format&fit=crop&w=800&q=80",
         "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80",
      ],
      review:
         "Pantainya cantik dan itinerary disusun rapi sehingga kami bisa nikmati banyak spot. Staf sangat membantu ketika ada perubahan kecil di hari keberangkatan.",
      star: 5,
   },
   {
      id: 6,
      trip_id: 6,
      name: "Ricky Hartono",
      role: "Mountain Climber",
      images: [
         "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
      ],
      review:
         "Cocok untuk yang suka trekking: jalur terawat dan guide paham medan. Perlengkapan dasar disediakan namun sarankan bawa perlengkapan pribadi untuk kenyamanan maksimal.",
      star: 4,
   },
   {
      id: 7,
      trip_id: 7,
      name: "Maya Septiani",
      role: "Cultural Explorer",
      images: [
         "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?auto=format&fit=crop&w=800&q=80",
         "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80",
      ],
      review:
         "Perjalanan budaya yang informatif, guide menjelaskan sejarah dan adat dengan baik. Waktu kunjungan pas sehingga tidak terburu-buru, sangat cocok bagi yang ingin belajar budaya setempat.",
      star: 4,
   },
   {
      id: 8,
      trip_id: 8,
      name: "Deni Kusuma",
      role: "Food Tourist",
      images: [
         "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=800&q=80",
         "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
      ],
      review:
         "Rangkaian kulinernya menarik dan banyak rekomendasi tempat makan lokal. Beberapa makanan terlalu pedas untuk saya, tapi overall pengalaman kuliner memuaskan.",
      star: 4,
   },
   {
      id: 9,
      trip_id: 9,
      name: "Linda Wijaya",
      role: "Island Hopper",
      images: [
         "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80",
         "https://images.unsplash.com/photo-1468413253725-0d5181091126?auto=format&fit=crop&w=800&q=80",
      ],
      review:
         "Perjalanan pulau-ke-pulau rapi dan kapal nyaman. Guide sangat membantu mengatur waktu kunjungan sehingga semua spot utama bisa dikunjungi tanpa terburu-buru.",
      star: 5,
   },
];

export const openTrips = [
   {
      id: 1,
      title: "Bali Adventure",
      slug: "bali-adventure",
      city_id: 1,
      type: "open-trip",
      duration: "5D4N",
      price: 2599000,
      image: imageLists[0],
      min_people: 2,
      airport_id: 1,
      destinations: destinations.filter((d) => d.city_id === 1),
      content: `<p>
         Keindahan dan daya tarik Sumba telah menarik seluruh kalangan wisatawan. Sehingga,
         wisatawan sering menyebut Sumba sebagai Hawainya Indonesia. Sumba berhasil menyuguhkan
         berbagai panorama mulai dari pantai hingga air terjun nan Indah. Kecantikan alam Sumba dapat
         menjadi alternatif kamu jika sudah bosan dengan berbagai destinasi wisata Bali dan Labuan Bajo.
         </p>

         <p>Open Trip Sumba 4D3N adalah salah satu paket Tour Sumba yang ditawarkan IndonesiaJuara
         dengan mengunjungi destinasi terbaik di Pulau Sumba, Nusa Tenggara Timur seperti Air Terjun
         Tanggedu dan Bukit Tanarara. Selama 4 hari 3 malam, kamu akan menikmati indahnya savana,
         rumah adat, pantai, dan air terjun. Walaupun biasanya mengeksplorasi Sumba tidak sebentar, trip
         ini memastikan kamu untuk menyusuri seluruh keindahaan mulai dari Sumba Timur sampai ke
         Barat. Sehingga kamu akan mendapatkan liburan yang tidak terlupakan di Pulau Terindah di
         Dunia. Trip ini bersifat Open Trip atau rombongan yang memungkinkan kamu untuk berinteraksi
         dengan orang-orang baru selama perjalanan.</p>`,
      open_dates: [
         { from_date: "2024-11-10", to_date: "2024-11-14" },
         { from_date: "2024-12-05", to_date: "2024-12-09" },
         { from_date: "2025-01-15", to_date: "2025-01-19" },
      ],
      itinerary: [
         {
            day: 1,
            activities: [
               {
                  time: "08:00",
                  description:
                     "Tiba di Bandara Ngurah Rai, Bali. Bertemu dengan guide dan langsung menuju Pantai Kuta.",
               },
               {
                  time: "12:00",
                  description: "Makan siang di restoran lokal.",
               },
               {
                  time: "14:00",
                  description: "Check-in hotel dan istirahat sejenak.",
               },
               {
                  time: "16:00",
                  description:
                     "Jelajahi Pantai Kuta, nikmati sunset dan aktivitas pantai.",
               },
               {
                  time: "19:00",
                  description:
                     "Makan malam di Jimbaran dengan hidangan seafood segar.",
               },
            ],
         },
         {
            day: 2,
            activities: [
               { time: "07:00", description: "Sarapan di hotel." },
               {
                  time: "08:00",
                  description:
                     "Kunjungi Ubud: Monkey Forest, Pasar Seni Ubud, dan Tegalalang Rice Terrace.",
               },
               {
                  time: "12:00",
                  description: "Makan siang di restoran lokal di Ubud.",
               },
               {
                  time: "14:00",
                  description: "Kunjungi Tirta Empul dan Gunung Kawi.",
               },
               {
                  time: "18:00",
                  description: "Kembali ke hotel dan istirahat.",
               },
               {
                  time: "19:30",
                  description: "Makan malam di restoran lokal.",
               },
            ],
         },
         {
            day: 3,
            activities: [
               { time: "06:00", description: "Sarapan di hotel." },
               {
                  time: "07:00",
                  description:
                     "Perjalanan ke Tanah Lot, nikmati pemandangan pura di tepi laut.",
               },
               {
                  time: "12:00",
                  description: "Makan siang di restoran lokal.",
               },
               {
                  time: "14:00",
                  description:
                     "Kunjungi Pantai Seminyak untuk bersantai dan berbelanja.",
               },
               {
                  time: "18:00",
                  description: "Kembali ke hotel dan istirahat.",
               },
               {
                  time: "19:30",
                  description: "Makan malam di restoran lokal.",
               },
            ],
         },
      ],
      testimonials: testimonials.slice(0, 3),
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

export const tripsData = [
   {
      id: 1,
      title: "Bali Adventure",
      slug: "bali-adventure",
      description:
         "Jelajahi keindahan alam dan budaya Bali dalam paket wisata lengkap 5 hari 4 malam.",
      city_id: 1,
      type: "open-trip",
      duration: "5D4N",
      price: 2599000,
      image: imageLists[0],
      images: imageLists,
      min_people: 2,
      meet_point: "Bandara Ngurah Rai, Bali",
      gmap_link:
         "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7886.884954486969!2d115.16137699235433!3d-8.744370465224094!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd2441650216933%3A0xdf71da6ddd7bcc1f!2sI%20Gusti%20Ngurah%20Rai%20International%20Airport!5e0!3m2!1sen!2sid!4v1762324555900!5m2!1sen!2sid",
      best_season: "April - Oktober",
      destinations: destinations.filter((d) => d.city_id === 1),
      content: `<p>Nikmati pengalaman wisata terbaik di Bali dengan mengunjungi destinasi ikonik seperti Pantai Kuta, Ubud, dan Tanah Lot. Paket ini mencakup akomodasi, transportasi, dan pemandu wisata profesional.</p>`,
      open_dates: [
         { from_date: "2024-11-10", to_date: "2024-11-14" },
         { from_date: "2024-12-05", to_date: "2024-12-09" },
         { from_date: "2025-01-15", to_date: "2025-01-19" },
      ],
      itinerary: [
         {
            day: 1,
            activities: [
               {
                  time: "08:00",
                  description:
                     "Tiba di Bandara Ngurah Rai, penjemputan oleh tim",
               },
               {
                  time: "10:00",
                  description: "Check-in hotel dan istirahat sejenak",
               },
               { time: "12:30", description: "Makan siang di Jimbaran" },
               { time: "15:00", description: "Kunjungan ke Pantai Kuta" },
               {
                  time: "18:00",
                  description: "Menikmati sunset di Seminyak Beach",
               },
               {
                  time: "20:00",
                  description: "Makan malam dan kembali ke hotel",
               },
            ],
         },
         {
            day: 2,
            activities: [
               { time: "07:00", description: "Sarapan di hotel" },
               {
                  time: "09:00",
                  description: "Kunjungan ke Ubud Monkey Forest",
               },
               { time: "12:00", description: "Makan siang di daerah Ubud" },
               {
                  time: "14:00",
                  description: "Melihat sawah terasering Tegalalang",
               },
               {
                  time: "17:00",
                  description: "Menyaksikan tari Kecak di Pura Uluwatu",
               },
               {
                  time: "19:30",
                  description: "Dinner di Jimbaran seafood restaurant",
               },
            ],
         },
         {
            day: 3,
            activities: [
               { time: "07:00", description: "Sarapan di hotel" },
               { time: "09:00", description: "Perjalanan ke Bedugul" },
               {
                  time: "11:00",
                  description: "Mengunjungi Danau Beratan dan Pura Ulun Danu",
               },
               {
                  time: "13:00",
                  description: "Makan siang di restoran tepi danau",
               },
               { time: "15:00", description: "Kunjungan ke Kebun Raya Bali" },
               { time: "18:00", description: "Kembali ke hotel" },
            ],
         },
         {
            day: 4,
            activities: [
               { time: "07:30", description: "Sarapan di hotel" },
               { time: "09:00", description: "Kunjungan ke Tanah Lot" },
               {
                  time: "11:00",
                  description: "Shopping di Krisna Oleh-oleh Bali",
               },
               { time: "13:00", description: "Makan siang di Denpasar" },
               { time: "15:00", description: "Waktu bebas di pantai" },
               { time: "19:00", description: "Makan malam farewell" },
            ],
         },
         {
            day: 5,
            activities: [
               { time: "07:00", description: "Sarapan dan check-out hotel" },
               { time: "09:00", description: "Waktu bebas di sekitar hotel" },
               {
                  time: "11:00",
                  description: "Perjalanan ke Bandara Ngurah Rai",
               },
               {
                  time: "13:00",
                  description: "Penerbangan kembali ke kota asal",
               },
            ],
         },
      ],
      testimonials: testiTrips,
   },
   {
      id: 2,
      title: "Yogyakarta Heritage",
      slug: "yogyakarta-heritage",
      description: "Jelajahi warisan budaya di kota istimewa Yogyakarta.",
      city_id: 2,
      type: "private-trip",
      duration: "2D1N",
      price: 1899000,
      image: imageLists[1],
      images: imageLists,
      min_people: 1,
      meet_point: "Bandara Adisucipto, Yogyakarta",
      gmap_link:
         "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.0083236807604!2d110.42810457525236!3d-7.788941192230919!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a50a9f995d21b%3A0xf027a77c64c3df0!2sAdisutjipto%20International%20Airport!5e0!3m2!1sen!2sid!4v1762324521749!5m2!1sen!2sid",
      best_season: "Juni - September",
      destinations: destinations.filter((d) => d.city_id === 2),
      content: `<p>Rasakan pesona kota budaya Yogyakarta dengan mengunjungi Candi Borobudur, Keraton, dan destinasi bersejarah lainnya.</p>`,
      open_dates: [],
      itinerary: [
         {
            day: 1,
            activities: [
               { time: "08:00", description: "Tiba di Bandara Adisutjipto" },
               { time: "09:00", description: "Check-in hotel dan istirahat" },
               { time: "11:00", description: "Kunjungan ke Candi Prambanan" },
               { time: "13:00", description: "Makan siang di restoran lokal" },
               { time: "15:00", description: "Jalan-jalan di Malioboro" },
               {
                  time: "19:00",
                  description: "Menikmati malam di Alun-Alun Kidul",
               },
            ],
         },
         {
            day: 2,
            activities: [
               { time: "06:00", description: "Sarapan pagi" },
               { time: "07:30", description: "Perjalanan ke Candi Borobudur" },
               { time: "11:00", description: "Makan siang di Magelang" },
               {
                  time: "13:00",
                  description: "Kunjungan ke Keraton Yogyakarta",
               },
               {
                  time: "15:00",
                  description: "Belanja oleh-oleh di Bakpia Pathok",
               },
               { time: "17:00", description: "Transfer ke bandara" },
            ],
         },
      ],
      testimonials: testiTrips,
   },
   {
      id: 3,
      title: "Komodo Adventure",
      slug: "komodo-adventure",
      description:
         "Petualangan seru menjelajahi Taman Nasional Komodo dan pulau eksotis sekitarnya.",
      city_id: 4,
      type: "open-trip",
      duration: "3D2N",
      price: 3599000,
      image: imageLists[2],
      images: imageLists,
      min_people: 4,
      meet_point: "Bandara Komodo, Labuan Bajo",
      gmap_link:
         "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3946.10834170245!2d119.88455927525949!3d-8.488845991552525!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2db465219938ff6f%3A0x65f416d9240eb787!2sKomodo%20International%20Airport!5e0!3m2!1sen!2sid!4v1762324479146!5m2!1sen!2sid",
      best_season: "Maret - November",
      destinations: destinations.filter((d) => d.city_id === 4),
      content: `<p>Nikmati pengalaman tak terlupakan bertemu komodo dan snorkeling di perairan jernih Labuan Bajo.</p>`,
      open_dates: [
         { from_date: "2024-10-15", to_date: "2024-10-17" },
         { from_date: "2024-11-20", to_date: "2024-11-22" },
      ],
      itinerary: [
         {
            day: 1,
            activities: [
               {
                  time: "08:00",
                  description: "Tiba di Bandara Komodo, penjemputan",
               },
               { time: "10:00", description: "Berlayar ke Pulau Kelor" },
               { time: "12:00", description: "Snorkeling di Pink Beach" },
               { time: "15:00", description: "Trekking ke Pulau Padar" },
               { time: "18:00", description: "Dinner di kapal" },
               { time: "20:00", description: "Menginap di kapal (Liveaboard)" },
            ],
         },
         {
            day: 2,
            activities: [
               { time: "06:00", description: "Sunrise di Pulau Padar" },
               { time: "08:00", description: "Kunjungan ke Pulau Komodo" },
               { time: "11:00", description: "Makan siang di kapal" },
               { time: "14:00", description: "Snorkeling di Manta Point" },
               { time: "17:00", description: "Santai di Pulau Kanawa" },
               { time: "20:00", description: "Barbecue malam di kapal" },
            ],
         },
         {
            day: 3,
            activities: [
               { time: "07:00", description: "Sarapan di kapal" },
               { time: "09:00", description: "Kembali ke Labuan Bajo" },
               { time: "11:00", description: "Belanja oleh-oleh lokal" },
               { time: "13:00", description: "Transfer ke bandara" },
            ],
         },
      ],
      testimonials: testiTrips,
   },
   {
      id: 4,
      title: "Bromo Sunrise",
      slug: "bromo-sunrise",
      description:
         "Nikmati keindahan matahari terbit dari Gunung Bromo yang legendaris.",
      city_id: 6,
      type: "private-trip",
      duration: "3D2N",
      price: 1299000,
      image: imageLists[0],
      images: imageLists,
      min_people: 1,
      meet_point: "Bandara Juanda, Surabaya",
      gmap_link:
         "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.7769976334293!2d112.7847140752484!3d-7.378871592630591!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e50b3bf959b9%3A0xc0ff7c58786318e8!2sJuanda%20International%20Airport!5e0!3m2!1sen!2sid!4v1762324444868!5m2!1sen!2sid",
      best_season: "Juli - September",
      destinations: destinations.filter((d) => d.city_id === 6),
      content: `<p>Saksikan keajaiban alam dari ketinggian Gunung Bromo dengan pemandangan matahari terbit yang memukau.</p>`,
      open_dates: [],
      itinerary: [
         {
            day: 1,
            activities: [
               {
                  time: "10:00",
                  description:
                     "Tiba di Bandara Juanda, perjalanan ke Probolinggo",
               },
               { time: "13:00", description: "Makan siang di perjalanan" },
               {
                  time: "16:00",
                  description: "Check-in penginapan dekat Bromo",
               },
               { time: "18:00", description: "Makan malam dan briefing trip" },
            ],
         },
         {
            day: 2,
            activities: [
               {
                  time: "03:00",
                  description: "Perjalanan ke Penanjakan untuk sunrise",
               },
               {
                  time: "05:00",
                  description: "Menikmati sunrise di Gunung Bromo",
               },
               { time: "07:00", description: "Trekking ke kawah Bromo" },
               { time: "10:00", description: "Sarapan dan kembali ke hotel" },
               { time: "13:00", description: "Wisata ke Bukit Teletubbies" },
               { time: "18:00", description: "Makan malam dan istirahat" },
            ],
         },
         {
            day: 3,
            activities: [
               { time: "08:00", description: "Sarapan dan check-out" },
               { time: "11:00", description: "Perjalanan kembali ke Surabaya" },
               { time: "14:00", description: "Belanja oleh-oleh" },
               { time: "16:00", description: "Transfer ke bandara" },
            ],
         },
      ],
      testimonials: testiTrips,
   },
   {
      id: 5,
      title: "Raja Ampat Explorer",
      slug: "raja-ampat-explorer",
      description:
         "Jelajahi surga bawah laut di Raja Ampat dengan keindahan terumbu karang dan ikan tropis.",
      city_id: 10,
      type: "open-trip",
      duration: "4D3N",
      price: 5999000,
      image: imageLists[1],
      images: imageLists,
      min_people: 6,
      meet_point: "Bandara Raja Ampat",
      gmap_link:
         "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.709998393986!2d130.77266707521426!3d-0.4222019995736525!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d5f02e77960e3f7%3A0xa7eaeab550a25ad5!2sMarinda%20Airport!5e0!3m2!1sen!2sid!4v1762323183984!5m2!1sen!2sid",
      best_season: "Oktober - April",
      destinations: destinations.filter((d) => d.city_id === 10),
      content: `<p>Nikmati diving dan snorkeling di lokasi terbaik dunia dengan pemandangan bawah laut yang menakjubkan.</p>`,
      open_dates: [
         { from_date: "2024-12-20", to_date: "2024-12-23" },
         { from_date: "2025-01-10", to_date: "2025-01-13" },
      ],
      itinerary: [
         {
            day: 1,
            activities: [
               {
                  time: "09:00",
                  description: "Tiba di Bandara Marinda, Waisai",
               },
               {
                  time: "11:00",
                  description: "Transfer ke resort dan check-in",
               },
               {
                  time: "13:00",
                  description: "Makan siang dan briefing diving",
               },
               {
                  time: "15:00",
                  description: "Diving sesi pertama di Friwen Wall",
               },
               { time: "18:00", description: "Makan malam di tepi pantai" },
            ],
         },
         {
            day: 2,
            activities: [
               { time: "07:00", description: "Sarapan pagi" },
               {
                  time: "09:00",
                  description: "Island hopping ke Pianemo Viewpoint",
               },
               { time: "12:00", description: "Makan siang di pulau kecil" },
               { time: "14:00", description: "Snorkeling di Arborek Village" },
               { time: "17:00", description: "Sunset di resort" },
               {
                  time: "20:00",
                  description: "Dinner dan sharing foto underwater",
               },
            ],
         },
         {
            day: 3,
            activities: [
               { time: "07:30", description: "Sarapan pagi" },
               { time: "09:00", description: "Diving di Melissa’s Garden" },
               { time: "12:00", description: "Lunch di kapal" },
               { time: "15:00", description: "Kunjungan ke desa lokal" },
               { time: "18:00", description: "Barbecue malam di pantai" },
            ],
         },
         {
            day: 4,
            activities: [
               { time: "07:00", description: "Sarapan dan check-out resort" },
               { time: "09:00", description: "Transfer ke bandara" },
               {
                  time: "11:00",
                  description: "Penerbangan kembali ke kota asal",
               },
            ],
         },
      ],
      testimonials: testiTrips,
   },
];

export const stepEvents = [
   {
      id: "1",
      title: "Event Planning",
      description: "Initial consultation and planning phase",
      content:
         "<p>This is the first step where we discuss your event requirements and preferences.</p><ul><li>Initial consultation</li><li>Requirement analysis</li><li>Budget planning</li></ul>",
   },
   {
      id: "2",
      title: "Venue Selection",
      description: "Finding the perfect location for your event",
      content:
         "<p>Based on your preferences, we will scout and select the ideal venue for your event.</p><ul><li>Venue scouting</li><li>Site visits</li><li>Contract negotiation</li></ul>",
   },
   {
      id: "3",
      title: "Catering & Decor",
      description: "Food and decoration arrangements",
      content:
         "<p>Coordinating all catering and decoration elements to match your vision.</p><ul><li>Catering selection</li><li>Menu planning</li><li>Decor theme</li></ul>",
   },
   {
      id: "4",
      title: "Final Execution",
      description: "Executing the event flawlessly",
      content:
         "<p>On the day of the event, our team manages everything to ensure success.</p><ul><li>Day-of coordination</li><li>Vendor management</li><li>Guest services</li></ul>",
   },
];

export const ctgEvents = [
   {
      id: 1,
      title: "Team Building",
      slug: "team-building",
      description: "Outbond | Inbond | Fun Games",
      content: `
         <h4>Layanan Meeting natavisual : Solusi untuk Meeting Profesional yang Efektif dan Berkesan</h4>
         <p>Corporate Meeting | Workshop | Online Meeting | Hybrid Meeting
            Di dunia bisnis yang serba cepat, meeting menjadi salah satu elemen penting untuk berbagi ide, mengambil keputusan strategis, dan membangun hubungan
            profesional. Namun, tidak semua meeting berjalan dengan efektif dan memberikan hasil maksimal. Di sinilah Nata Visual hadir dengan solusi lengkap untuk
            kebutuhan meeting Anda.</p>
         <h6>Mengapa Memilih Layanan Meeting dari Nata Visual?</h6>
         <ol>
            Kami memahami bahwa meeting bukan sekadar pertemuan biasa, tetapi momen penting yang dapat meningkatkan reputasi perusahaan dan membantu
            mencapai tujuan bisnis. Dengan pengalaman kami dalam mengelola berbagai jenis acara, layanan meeting dari Nata Visual dirancang untuk:
            <li>Meningkatkan Reputasi Perusahaan</li>
            <li>Meeting yang direncanakan dengan baik mencerminkan profesionalisme perusahaan Anda. Mulai dari pemilihan venue, dekorasi, hingga pengaturan
teknis, kami memastikan setiap detail mencerminkan nilai dan kredibilitas perusahaan Anda.</li>
            <li>Membantu Mencapai Tujuan Acara</li>
            <li>Apakah Anda ingin memperkenalkan produk baru, menyusun strategi bisnis, atau memperkuat kerja sama tim? Kami membantu mengelola setiap elemen
meeting agar mendukung tujuan utama Anda. Semua aspek kami sesuaikan untuk memastikan hasil yang optimal.</li>
            <li>Memberikan Pengalaman Tak Terlupakan</li>
            <li>Dengan layanan yang berfokus pada detail, kami menciptakan suasana meeting yang nyaman dan profesional. Mulai dari penyediaan fasilitas audiovisual
berkualitas tinggi hingga layanan konsumsi yang memanjakan, kami berkomitmen memberikan pengalaman terbaik bagi semua peserta.</li>
         </ol>
         <h6>Apa Saja yang Kami Tawarkan?</h6>
         <ul>
            <li>Venue Management : Pemilihan lokasi yang strategis dan sesuai dengan kebutuhan meeting Anda.</li>
            <li>Setup dan Dekorasi : Pengaturan ruang meeting yang profesional dan nyaman.</li>
            <li>Fasilitas Audiovisual : Peralatan teknologi terkini untuk mendukung presentasi dan diskusi.</li>
            <li>Dokumentasi Multimedia : Dokumentasi lengkap berupa foto dan video untuk arsip atau kebutuhan promosi perusahaan.</li>
            <li>Layanan Konsumsi : Pilihan menu makanan dan minuman berkualitas untuk mendukung kenyamanan peserta.</li>
         </ul>
      `,
      image: "https://placehold.co/720x480?text=DetailEventService",
      galleries: imageLists.map(img => img.path)
   },
   {
      id: 2, 
      title: "MICE",
      slug: "mice",
      description: "Meeting | Incentive | Conference | Exhibition | Corporate Meeting | Workshop | Online Meeting | Hybrid Meeting",
      content: `
         <h4>Layanan Meeting natavisual : Solusi untuk Meeting Profesional yang Efektif dan Berkesan</h4>
         <p>Corporate Meeting | Workshop | Online Meeting | Hybrid Meeting
            Di dunia bisnis yang serba cepat, meeting menjadi salah satu elemen penting untuk berbagi ide, mengambil keputusan strategis, dan membangun hubungan
            profesional. Namun, tidak semua meeting berjalan dengan efektif dan memberikan hasil maksimal. Di sinilah Nata Visual hadir dengan solusi lengkap untuk
            kebutuhan meeting Anda.</p>
         <h6>Mengapa Memilih Layanan Meeting dari Nata Visual?</h6>
         <ol>
            Kami memahami bahwa meeting bukan sekadar pertemuan biasa, tetapi momen penting yang dapat meningkatkan reputasi perusahaan dan membantu
            mencapai tujuan bisnis. Dengan pengalaman kami dalam mengelola berbagai jenis acara, layanan meeting dari Nata Visual dirancang untuk:
            <li>Meningkatkan Reputasi Perusahaan</li>
            <li>Meeting yang direncanakan dengan baik mencerminkan profesionalisme perusahaan Anda. Mulai dari pemilihan venue, dekorasi, hingga pengaturan
teknis, kami memastikan setiap detail mencerminkan nilai dan kredibilitas perusahaan Anda.</li>
            <li>Membantu Mencapai Tujuan Acara</li>
            <li>Apakah Anda ingin memperkenalkan produk baru, menyusun strategi bisnis, atau memperkuat kerja sama tim? Kami membantu mengelola setiap elemen
meeting agar mendukung tujuan utama Anda. Semua aspek kami sesuaikan untuk memastikan hasil yang optimal.</li>
            <li>Memberikan Pengalaman Tak Terlupakan</li>
            <li>Dengan layanan yang berfokus pada detail, kami menciptakan suasana meeting yang nyaman dan profesional. Mulai dari penyediaan fasilitas audiovisual
berkualitas tinggi hingga layanan konsumsi yang memanjakan, kami berkomitmen memberikan pengalaman terbaik bagi semua peserta.</li>
         </ol>
         <h6>Apa Saja yang Kami Tawarkan?</h6>
         <ul>
            <li>Venue Management : Pemilihan lokasi yang strategis dan sesuai dengan kebutuhan meeting Anda.</li>
            <li>Setup dan Dekorasi : Pengaturan ruang meeting yang profesional dan nyaman.</li>
            <li>Fasilitas Audiovisual : Peralatan teknologi terkini untuk mendukung presentasi dan diskusi.</li>
            <li>Dokumentasi Multimedia : Dokumentasi lengkap berupa foto dan video untuk arsip atau kebutuhan promosi perusahaan.</li>
            <li>Layanan Konsumsi : Pilihan menu makanan dan minuman berkualitas untuk mendukung kenyamanan peserta.</li>
         </ul>
      `,
      image: "https://placehold.co/720x480?text=DetailEventService",
      galleries: imageLists.map(img => img.path)
   },
   {
      id: 3,
      title: "Gathering",
      slug: "gathering",
      description: "Company Gathering | Family Gathering | Community Gathering",
      content: `
         <h4>Layanan Meeting natavisual : Solusi untuk Meeting Profesional yang Efektif dan Berkesan</h4>
         <p>Corporate Meeting | Workshop | Online Meeting | Hybrid Meeting
            Di dunia bisnis yang serba cepat, meeting menjadi salah satu elemen penting untuk berbagi ide, mengambil keputusan strategis, dan membangun hubungan
            profesional. Namun, tidak semua meeting berjalan dengan efektif dan memberikan hasil maksimal. Di sinilah Nata Visual hadir dengan solusi lengkap untuk
            kebutuhan meeting Anda.</p>
         <h6>Mengapa Memilih Layanan Meeting dari Nata Visual?</h6>
         <ol>
            Kami memahami bahwa meeting bukan sekadar pertemuan biasa, tetapi momen penting yang dapat meningkatkan reputasi perusahaan dan membantu
            mencapai tujuan bisnis. Dengan pengalaman kami dalam mengelola berbagai jenis acara, layanan meeting dari Nata Visual dirancang untuk:
            <li>Meningkatkan Reputasi Perusahaan</li>
            <li>Meeting yang direncanakan dengan baik mencerminkan profesionalisme perusahaan Anda. Mulai dari pemilihan venue, dekorasi, hingga pengaturan
teknis, kami memastikan setiap detail mencerminkan nilai dan kredibilitas perusahaan Anda.</li>
            <li>Membantu Mencapai Tujuan Acara</li>
            <li>Apakah Anda ingin memperkenalkan produk baru, menyusun strategi bisnis, atau memperkuat kerja sama tim? Kami membantu mengelola setiap elemen
meeting agar mendukung tujuan utama Anda. Semua aspek kami sesuaikan untuk memastikan hasil yang optimal.</li>
            <li>Memberikan Pengalaman Tak Terlupakan</li>
            <li>Dengan layanan yang berfokus pada detail, kami menciptakan suasana meeting yang nyaman dan profesional. Mulai dari penyediaan fasilitas audiovisual
berkualitas tinggi hingga layanan konsumsi yang memanjakan, kami berkomitmen memberikan pengalaman terbaik bagi semua peserta.</li>
         </ol>
         <h6>Apa Saja yang Kami Tawarkan?</h6>
         <ul>
            <li>Venue Management : Pemilihan lokasi yang strategis dan sesuai dengan kebutuhan meeting Anda.</li>
            <li>Setup dan Dekorasi : Pengaturan ruang meeting yang profesional dan nyaman.</li>
            <li>Fasilitas Audiovisual : Peralatan teknologi terkini untuk mendukung presentasi dan diskusi.</li>
            <li>Dokumentasi Multimedia : Dokumentasi lengkap berupa foto dan video untuk arsip atau kebutuhan promosi perusahaan.</li>
            <li>Layanan Konsumsi : Pilihan menu makanan dan minuman berkualitas untuk mendukung kenyamanan peserta.</li>
         </ul>
      `,
      image: "https://placehold.co/720x480?text=DetailEventService",
      galleries: imageLists.map(img => img.path)
   }
]