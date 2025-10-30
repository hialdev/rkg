import React, { useEffect } from "react";
import { useLocale } from "../../contexts/LocaleContext";
import { getMenus } from "../../config/menu";
import SwitchLang from "./SwitchLang";

interface MenuItem {
   name: string;
   path: string;
   childerns: MenuItem[];
}

interface LocaleMenuProps {
   isFloating?: boolean;
}

const LocaleMenu: React.FC<LocaleMenuProps> = ({ isFloating = false }) => {
   const { locale } = useLocale();
   const menus = getMenus(locale as "en" | "id");
   const [scrolled, setScrolled] = React.useState(false);
   const currentPath = window.location.pathname;
   const isActiveMenu = (menuPaths: string[]) => {
      return menuPaths.includes(currentPath);
   };

   useEffect(() => {
      const handleScroll = () => {
         const isScrolled = window.scrollY >= 160 && isFloating;
         console.log('Scrolled:', isScrolled, 'Is Floating:', isFloating);
         setScrolled(isScrolled);
      };

      window.addEventListener('scroll', handleScroll);
      return () => {
         window.removeEventListener('scroll', handleScroll);
      };
   }, [isFloating]);

   return (
      <>
         {/* NAV MENU (DESKTOP) */}
         <div className="flex items-center gap-6">
            <ul
               className={`hidden md:flex items-center gap-6 font-medium ${
                  !isFloating || scrolled ? "text-gray-800" : "text-white"
               }`}
            >
               {menus.map((menu: MenuItem, index: number) => (
                  <li key={index} className="relative group">
                        <a
                           href={menu.path}
                           className={`flex items-center gap-1 transition relative after:absolute after:-bottom-3 after:left-0 after:h-1 after:w-0 hover:after:w-3/5 after:rounded-full after:transition-all ${
                              isActiveMenu([menu.path]) ? "after:bg-red-500 text-red-500 after:w-3/5" :
                              !isFloating || scrolled ? "after:bg-gray-800" : "after:bg-white"
                           }`}
                        >
                        {menu.name}
                        {menu.childerns.length > 0 && (
                           <svg
                           xmlns="http://www.w3.org/2000/svg"
                           className="h-4 w-4 transition-transform group-hover:rotate-180"
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
                        </a>

                     {menu.childerns.length > 0 && (
                        <ul className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg mt-1 rounded-md min-w-[180px] z-20 text-gray-700">
                           {menu.childerns.map(
                              (child: MenuItem, childIndex: number) => (
                                 <li
                                    key={childIndex}
                                    className="relative group/drop"
                                 >
                                    <a
                                       href={child.path}
                                       className="flex items-center text-stone-900 rounded-lg justify-between px-5 py-3 hover:bg-rose-50 hover:text-rose-700"
                                    >
                                       {child.name}
                                       {child.childerns &&
                                          child.childerns.length > 0 && (
                                             <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
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
                                    </a>

                                    {child.childerns &&
                                       child.childerns.length > 0 && (
                                          <ul className="absolute top-0 left-full hidden group-hover/drop:block bg-white shadow-lg rounded-md min-w-[180px] text-gray-700">
                                             {child.childerns.map(
                                                (
                                                   sub: MenuItem,
                                                   subIndex: number
                                                ) => (
                                                   <li key={subIndex}>
                                                      <a
                                                         href={sub.path}
                                                         className="block text-stone-900 rounded-lg px-5 py-3 hover:bg-rose-50 hover:text-rose-700"
                                                      >
                                                         {sub.name}
                                                      </a>
                                                   </li>
                                                )
                                             )}
                                          </ul>
                                       )}
                                 </li>
                              )
                           )}
                        </ul>
                     )}
                  </li>
               ))}
            </ul>

            {/* Language Switcher */}
            <div className="hidden md:block" id="language-switcher">
               <SwitchLang />
            </div>
         </div>
      </>
   );
};

export default LocaleMenu;
