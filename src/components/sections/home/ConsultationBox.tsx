import React from "react";
import ConsultationForm from "../../cards/ConsultationForm";

const ConsultationBox: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h2 className="text-5xl font-medium mb-5">Free Consultation, Fast Quote</h2>
      <div className="text-lg mb-10">Your first step toward the best solution starts here.</div>
      <ConsultationForm />
    </div>
  );
};

export default ConsultationBox;
