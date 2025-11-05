import React, { useEffect, useState } from "react";

interface EmbedGmapProps {
   gmapLink: string;
}

const EmbedGmap: React.FC<EmbedGmapProps> = ({ gmapLink }) => {
   const [embedSrc, setEmbedSrc] = useState("");

   useEffect(() => {
      async function resolveEmbedUrl(url: string) {
         if (!url) return "";

         // deteksi shortlink maps.app.goo.gl atau goo.gl/maps
         const isShort = /maps\.app\.goo\.gl|goo\.gl\/maps/.test(url);
         if (isShort) {
            try {
               const res = await fetch(url, {
                  method: "HEAD",
                  redirect: "follow",
               });
               const resolvedUrl = res.url;

               // coba ambil koordinat dari URL redirect
               const match = resolvedUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
               if (match) {
                  const lat = match[1];
                  const lng = match[2];
                  return `https://www.google.com/maps?q=${lat},${lng}&output=embed`;
               }

               // fallback: gunakan URL hasil redirect sebagai query
               return `https://www.google.com/maps?q=${encodeURIComponent(
                  resolvedUrl
               )}&output=embed`;
            } catch (err) {
               console.error("Gagal resolve shortlink:", err);
               return `https://www.google.com/maps?q=${encodeURIComponent(
                  url
               )}&output=embed`;
            }
         }

         // jika sudah embed link langsung
         if (url.includes("output=embed")) return url;

         // kalau link biasa (misalnya https://www.google.com/maps/place/...)
         return `https://www.google.com/maps?q=${encodeURIComponent(
            url
         )}&output=embed`;
      }

      resolveEmbedUrl(gmapLink).then(setEmbedSrc);
   }, [gmapLink]);

   if (!embedSrc)
      return (
         <div className="w-full h-[25em] flex items-center justify-center bg-gray-100 rounded-xl">
            <span className="text-gray-500 text-sm">Memuat peta...</span>
         </div>
      );

   return (
      <iframe
         src={embedSrc}
         style={{ width: "100%", height: "25em", border: 0 }}
         allowFullScreen
         loading="lazy"
         referrerPolicy="no-referrer-when-downgrade"
         className="rounded-xl shadow"
      />
   );
};

export default EmbedGmap;
