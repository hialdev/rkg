import React from "react";
import { icons } from "../config/offline-icon";

export interface OfflineIconProps {
   name: keyof typeof icons;
   className?: string;
   style?: React.CSSProperties;
   size?: number;
}

export default function OfflineIcon({
   name,
   className = "",
   style = {},
   size = 24,
}: OfflineIconProps) {
   const svgString = icons[name];
   if (!svgString) {
      return <span>⚠️ Icon not found: {name}</span>;
   }

   // Ganti width & height
   const updatedSvg = svgString
      .replace(/width="[^"]*"/, `width="${size}"`)
      .replace(/height="[^"]*"/, `height="${size}"`)
      .replace(
         /<svg/,
         '<svg style="display: inline-block; vertical-align: middle;"'
      );

   return (
      <span
         className={className}
         style={style}
         dangerouslySetInnerHTML={{ __html: updatedSvg }}
      />
   );
}
