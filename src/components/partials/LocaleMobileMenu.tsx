import React from "react";
import { useLocale } from "../../contexts/LocaleContext";
import { getMenus } from "../../config/menu";

interface MenuItem {
   name: string;
   path: string;
   childerns: MenuItem[];
}

interface LocaleMobileMenuProps {
   onClose: () => void;
}

const LocaleMobileMenu: React.FC<LocaleMobileMenuProps> = ({ onClose }) => {
   const { locale } = useLocale();
   const menus = getMenus(locale as "en" | "id");

   React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
         if (e.key === "Escape") {
            onClose();
         }
      };

      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
   }, [onClose]);

   return (
      <div className="w-full bg-white">
         {menus.map((menu: MenuItem, index: number) => (
            <div key={index} className="w-full mb-4">
               <details className="group overflow-visible">
                  <summary className="cursor-pointer flex justify-between items-center py-2 text-lg font-medium hover:text-rose-60 text-gray-800">
                     {menu.name}
                     {menu.childerns.length > 0 && (
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           className="h-4 w-4 transition-transform group-open:rotate-180"
                           fill="none"
                           viewBox="0 0 24 24"
                           stroke="currentColor"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                           />
                        </svg>
                     )}
                  </summary>
                  {menu.childerns.length > 0 && (
                     <div className="pl-4 border-l border-gray-200">
                        {menu.childerns.map(
                           (child: MenuItem, childIndex: number) => (
                              <details
                                 key={childIndex}
                                 className="group overflow-visible"
                              >
                                 <summary className="cursor-pointer flex justify-between items-center hover:text-rose-60 text-gray-800">
                                    <a href={child.path} className="p-2 px-4 hover:bg-stone-100 rounded-xl">{child.name}</a>
                                    {child.childerns &&
                                       child.childerns.length > 0 && (
                                          <svg
                                             xmlns="http://www.w3.org/2000/svg"
                                             className="h-4 w-4 transition-transform group-open:rotate-180"
                                             fill="none"
                                             viewBox="0 0 24 24"
                                             stroke="currentColor"
                                          >
                                             <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 5l7 7-7 7"
                                             />
                                          </svg>
                                       )}
                                 </summary>
                                 {child.childerns &&
                                    child.childerns.length > 0 && (
                                       <ul className="pl-4 border-l border-gray-200">
                                          {child.childerns.map(
                                             (
                                                sub: MenuItem,
                                                subIndex: number
                                             ) => (
                                                <li
                                                   key={subIndex}
                                                   className="py-1 hover:text-rose-600 text-gray-800"
                                                >
                                                   <a
                                                      href={sub.path}
                                                      onClick={onClose}
                                                   >
                                                      {sub.name}
                                                   </a>
                                                </li>
                                             )
                                          )}
                                       </ul>
                                    )}
                              </details>
                           )
                        )}
                     </div>
                  )}
               </details>
            </div>
         ))}
      </div>
   );
};

export default LocaleMobileMenu;
