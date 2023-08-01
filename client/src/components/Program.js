import React from "react";
import { useSelector } from "react-redux";
import { useMatch } from "react-router-dom";

const Program = () => {
  const match = useMatch("/programs/:id");
  const programs = useSelector((state) => state.programs);

  const program = match ? programs.find((p) => p.id === match.params.id) : null;
  console.log(program);

  if (!program) {
    return null;
  }

  return (
    <div>
      <h2>Program</h2>
    </div>
  );
};

export default Program;
