import { useLocale } from "../../../contexts/LocaleContext";
import PakRiza from "../../../assets/pakriza.png";
import React, { useEffect, useState } from "react";
import { getSetting } from "../../../fetchers";

interface About {
   founder: {
      desc?: string | number;
      role?: string | number;
      name?: string | number;
      image?: any;
   };
   section: {
      content?: string | number;
      image?: any;
   };
}
export default function AboutView() {
   const { translations } = useLocale();

   const [about, setAbout] = useState<About | null>();
   const fetchAbout = async () => {
      const founderDesc = await getSetting("about.founder.description");
      const founderImage = await getSetting("about.founder.image");
      const founderRole = await getSetting("about.founder.role");
      const founderName = await getSetting("about.founder.name");

      const sectionImage = await getSetting("about.section.image");
      const sectionContent = await getSetting("about.section.content");

      const about = {
         founder: {
            desc: founderDesc.data.data.set_value,
            role: founderRole.data.data.set_value,
            name: founderName.data.data.set_value,
            image: import.meta.env.PUBLIC_API_URL +'/'+ founderImage.data.data.set_value,
         },
         section: {
            content: sectionContent.data.data.set_value,
            image: import.meta.env.PUBLIC_API_URL +'/'+ sectionImage.data.data.set_value,
         },
      };

      setAbout(about);
   };

   useEffect(() => {
      fetchAbout();
   }, []);
   return (
      <>
         <section className="md:pt-50">
            <div className="bg-linear-to-br from-orange-400 p-10 pb-0 md:p-0 md:rounded-tl-[7em] to-orange-50">
               <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
                  <div className="">
                     <p>{about?.founder.desc ?? translations.about?.introOwner}</p>
                     <div className="mt-10">
                        <div className="text-3xl font-bold">
                           {about?.founder.name ?? translations.about?.nameOwner}
                        </div>
                        <div className="italic font-medium">
                           {about?.founder.role ?? translations.about?.positionOwner}
                        </div>
                     </div>
                  </div>

                  <img
                     src={about?.founder.image ?? PakRiza.src}
                     alt={`Owner of ${about?.founder.name ?? translations.about?.nameOwner}`}
                     className="block md:-mt-[10em] w-full max-h-[40em]"
                  />
               </div>
            </div>
         </section>

         <section className="py-20">
            <div className="container mx-auto">
               <h1 className="text-3xl p-5 bg-linear-to-r from-orange-400 to-orange-50/0 font-medium mb-10">
                  {translations.about?.title || "About Us"}
               </h1>
               <div className="flex flex-col md:flex-row px-3 items-center gap-10">
                  <img
                     src={about?.section.image ?? "https://placehold.co/720x480"}
                     alt="Placeholder image about"
                     className="block w-full aspect-video max-h-[20em] object-cover rounded-2xl"
                  />
                  <div>
                     {(() => {
                        const content = about?.section.content ?? translations.about?.content;
                        if (!content) return null;

                        const containsHtml = /<\/?[a-z][\s\S]*>/i.test(content);
                        if (containsHtml) {
                           // Prefer parsing HTML so we can add classes to paragraph tags.
                           if (
                              typeof window === "undefined" ||
                              typeof DOMParser === "undefined"
                           ) {
                              // Fallback for SSR or environments without DOMParser
                              return (
                                 <div
                                    dangerouslySetInnerHTML={{
                                       __html: content,
                                    }}
                                 />
                              );
                           }

                           const parser = new DOMParser();
                           const doc = parser.parseFromString(
                              content,
                              "text/html"
                           );
                           const children = Array.from(doc.body.childNodes);

                           const renderNode = (
                              node: ChildNode,
                              idx: number
                           ): React.ReactNode => {
                              if (node.nodeType === Node.TEXT_NODE)
                                 return node.textContent;
                              if (node.nodeType !== Node.ELEMENT_NODE)
                                 return null;

                              const el = node as Element;
                              const tag = el.tagName.toLowerCase();
                              const inner = Array.from(el.childNodes).map(
                                 (n, i) => renderNode(n, i)
                              );

                              if (tag === "p") {
                                 return (
                                    <p key={idx} className="mb-4">
                                       {inner}
                                    </p>
                                 );
                              }

                              if (tag === "br") return <br key={idx} />;

                              // Preserve other tags generically
                              return React.createElement(
                                 tag,
                                 { key: idx },
                                 inner
                              );
                           };

                           return (
                              <div>
                                 {children.map((n, i) => renderNode(n, i))}
                              </div>
                           );
                        }

                        return (
                           <>
                              {content
                                 .split("\n\n")
                                 .map((para: string, i: number) => (
                                    <p key={i} className="mb-10">
                                       {para.split("\n").map((line, j) =>
                                          j === 0 ? (
                                             line
                                          ) : (
                                             <React.Fragment key={j}>
                                                <br />
                                                {line}
                                             </React.Fragment>
                                          )
                                       )}
                                    </p>
                                 ))}
                           </>
                        );
                     })()}
                  </div>
               </div>
            </div>
         </section>
      </>
   );
}
