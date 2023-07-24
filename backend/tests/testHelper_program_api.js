const Program = require("../models/program");

const testDataList = [
  {
    name: "Math Program",
    students: 20,
    weeks: 8,
    description: "A comprehensive math program for students.",
    classes: 16,
    status: true,
    pricing: 800,
    invoice: "INV-67890",
    staff: {
      coordinator: "Alice Johnson",
      instructor: "Bob Williams",
    },
    files: {
      syllabus: "https://example.com/math-program-syllabus.pdf",
      schedule: "https://example.com/math-program-schedule.pdf",
    },
  },
  {
    name: "Science Program",
    students: 25,
    weeks: 10,
    description: "An exciting science program exploring various topics.",
    classes: 20,
    status: false,
    pricing: 1000,
    invoice: "INV-54321",
    staff: {
      coordinator: "Eve Smith",
      instructor: "Michael Brown",
    },
    files: {
      syllabus: "https://example.com/science-program-syllabus.pdf",
      schedule: "https://example.com/science-program-schedule.pdf",
    },
  },
];

const dataInDb = async () => {
  const programs = await Program.find({});
  return programs.map((program) => program.toJSON());
};
module.exports = { testDataList, dataInDb };
