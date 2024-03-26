import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
        className="bg-emerald-50 shadow-md rounded-lg p-4 hover:scale-110 hover:shadow-lg transition-all cursor-pointer"
        role="button"
        tabIndex={0}
        onKeyDown={() => {}}
      >
        <p>{partner.name}</p>
        <p>{partner.email}</p>
        <p>{partner.phone}</p>
      </div>
    );
  });
  const modalRef = useRef();
  return (
    <div className="lg:px-8">
      <div className="flex justify-end">
        <Modal ref={modalRef} header="New Partner Form">
          <PartnerForm closeModal={() => modalRef.current.close()} />
        </Modal>
        <button
          type="button"
          onClick={() => modalRef.current.openModal()}
          className="bg-emerald-950 text-white font-bold p-2 rounded-lg hover:scale-105 transition-all"
        >
          Create Partner
        </button>
      </div>
      <div className="shadow-lg rounded-lg p-4 border border-gray-50 mt-4">
        <h2 className="font-bold mb-4">Partners</h2>
        <div className="p-2 bg-transparent overflow-y-auto overflow-x-hidden grid gap-4 grid-cols-2 lg:grid-cols-4">
          {partnerCards}
        </div>
      </div>
    </div>
  );
};
export default Partners;
