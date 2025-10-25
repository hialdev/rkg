/**
 * Format date ke bentuk dan locale tertentu.
 *
 * @param {string|Date} dateInput - Tanggal dalam format string atau objek Date
 * @param {Object} options
 * @param {string} [options.locale='id-ID'] - Locale (misalnya 'id-ID', 'en-US')
 * @param {string} [options.format='long'] - Format tampilan: 'short' | 'medium' | 'long' | 'full' | 'custom'
 * @param {Object} [options.custom] - Jika format='custom', tentukan sendiri field dateStyle/timeStyle
 *
 * @returns {string} Tanggal yang sudah diformat
 */

interface OptionsType {
   locale?: string;
   format?: "short" | "medium" | "long" | "full" | "custom";
   custom?: Pick<Intl.DateTimeFormatOptions, "day" | "month" | "year">;
}

export function formatDate(
   dateInput: string | Date,
   options: OptionsType = {}
) {
   const { locale = "en-US", format = "long", custom } = options;

   const date = new Date(dateInput);
   if (isNaN(date.getTime())) return "";

   const formatOptions: Intl.DateTimeFormatOptions = (() => {
      switch (format) {
         case "short":
            return { dateStyle: "short" };
         case "medium":
            return { dateStyle: "medium" };
         case "long":
            return { dateStyle: "long" };
         case "full":
            return { dateStyle: "full" };
         case "custom":
            return (
               custom || { day: "2-digit", month: "short", year: "numeric" }
            );
         default:
            return { dateStyle: "long" };
      }
   })();

   return new Intl.DateTimeFormat(locale, formatOptions).format(date);
}
