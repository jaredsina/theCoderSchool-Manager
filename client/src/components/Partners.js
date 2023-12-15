import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Modal from "./Modal";
import PartnerForm from "./PartnerForm";

const Partners = () => {
  const partners = useSelector((state) => state.partners);
  const navigate = useNavigate();
  const partnerCards = partners.map((partner) => {
    return (
      <div
        key={partner.id}
        onClick={() => navigate(`/dashboard/${partner.id}`)}
      >
        <p>{partner.name}</p>
      </div>
    );
  });
  const modalRef = useRef();
  return (
    <div>
      <h1>Partners</h1>
      <Modal ref={modalRef} header="New Partner Form">
        <PartnerForm closeModal={() => modalRef.current.close()} />
      </Modal>
      <button
        type="button"
        onClick={() => modalRef.current.openModal()}
        className="bg-emerald-950 text-white font-bold px-4 py-2 rounded hover:scale-105 transition-all"
      >
        Create Partner
      </button>
      {partnerCards}
    </div>
  );
};
export default Partners;
