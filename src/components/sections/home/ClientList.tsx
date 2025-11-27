import React, { useEffect, useState } from "react";
import { clients } from "../../../mock";
import { getClients, type Client } from "../../../fetchers";

const ClientList: React.FC = () => {
   const [clients, setClients] = useState<Client[] | []>([])

   const fetchClients = async () => {
      const res = await getClients()
      setClients(res.data.data)
   }

   useEffect(() => {
      fetchClients()
   },[])
   return (
      <div className="container mx-auto">
         <h2 className="text-5xl font-medium mb-10">Our Clients</h2>
         <div className="grid grid-cols-12 gap-4">
            {clients.map((client) => (
               <div key={client.id} className="col-span-3 md:col-span-2">
                  <div className="flex items-center justify-center p-5">
                     <img
                        src={import.meta.env.PUBLIC_API_URL+'/'+client.image}
                        alt={client.title + " logo"}
                        width={100}
                        height={50}
                        className="object-contain"
                     />
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

export default ClientList;
