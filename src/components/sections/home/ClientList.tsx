import React from "react";
import { clients } from "../../../mock";

const ClientList: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h2 className="text-5xl font-medium mb-10">Our Clients</h2>
      <div className="grid grid-cols-12 gap-4">
        {clients.map((client) => (
          <div key={client.id} className="col-span-3 md:col-span-2">
            <div className="flex items-center justify-center p-5">
              <img
                src={client.logo}
                alt={client.name + " logo"}
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
