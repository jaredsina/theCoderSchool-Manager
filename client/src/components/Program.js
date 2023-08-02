import React from "react";
import { useSelector } from "react-redux";
import { useMatch } from "react-router-dom";

const Program = () => {
  const match = useMatch("/dashboard/:id");
  const programs = useSelector((state) => state.programs);

  const program = match ? programs.find((p) => p.id === match.params.id) : null;
  if (!program) {
    return null;
  }
  return (
    <div>
      <h2>Program</h2>
      <h3>{program.name}</h3>
      <p>{program.status ? "Active: True" : "Active: False"}</p>
      <p>{program.description}</p>
      <p>Invoice due date: {program.invoice}</p>
      <p>Number of classes: {program.classes}</p>
      <p>Number of students: {program.students}</p>
      <p>Price Per Student: {program.pricing}</p>
      <p>Price Per month: {program.pricing * program.students}</p>
      <p>Program Total: {program.pricing * program.students * program.weeks}</p>
      <p>Number of weeks in the program: {program.weeks}</p>
      <p>Assigned Staff: {program.staff}</p>
      <p>Task Alerts: </p>
      <p>Files: </p>
    </div>
  );
};

export default Program;
