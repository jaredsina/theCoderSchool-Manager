import React from "react";
import { useSelector } from "react-redux";

// this component is to display Notification messages to the user
const Notification = () => {
  const message = useSelector((state) => state.notification.message);
  if (message === null) {
    return null;
  }
  return (
    <div className="Notification">
      <p>{message}</p>
    </div>
  );
};

export default Notification;
