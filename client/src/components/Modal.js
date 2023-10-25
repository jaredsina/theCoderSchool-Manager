import React, { forwardRef, useState, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const Modal = forwardRef((props, ref) => {
  const [display, setDisplay] = useState(false);

  const open = () => {
    setDisplay(true);
  };

  const close = () => {
    setDisplay(false);
  };

  // expose the open and close methods to the parent component
  useImperativeHandle(ref, () => {
    return {
      openModal: () => open(),
      close: () => close(),
    };
  });

  if (display) {
    return (
      <div className="modal fixed inset-0 z-50 w-full h-full p-4 overflow-x-hidden overflow-y-auto">
        {/*  eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
        <div
          className="modal-overlay fixed inset-0 bg-slate-900/25 backdrop-blur opacity-100"
          onClick={() => {
            close();
          }}
        />
        <div className="modal-content relative bg-white rounded-lg lg:mx-52">
          <div className="modal-header flex items-center justify-between border-b p-4 text-lg">
            <h3 className="font-bold">{props.header}</h3>
            <button type="button" onClick={() => close()}>
              <FontAwesomeIcon
                icon={faXmark}
                style={{
                  fontSize: "1.25rem",
                }}
              />
            </button>
          </div>
          <div className="modal-body p-4">{props.children}</div>
        </div>
      </div>
    );
  }
  return null;
});

Modal.displayName = "Modal";
export default Modal;

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  header: PropTypes.string.isRequired,
};
