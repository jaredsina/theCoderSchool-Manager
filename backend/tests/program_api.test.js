//allows us to make requests to our express app
const supertest = require("supertest");
const { app, server } = require("../index");
const api = supertest(app);

//to close the connection to the database
const mongoose = require("mongoose");

const Program = require("../models/program");

const { testDataList, dataInDb } = require("./testHelper_program_api");

//reset test db for consistent results
beforeEach(async () => {
  await Program.deleteMany({});
  const uploadedUser = await Program.create(testDataList[0]);
});

describe("get route", () => {
  test("should return a program", async () => {
    const response = await api
      .get("/api/programs/")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(response.body).toHaveLength(1);
  });
  test("should return an error with incorrect endpoint", async () => {
    const response = await api
      .get("/api/program/")
      .expect(404)
      .expect("Content-Type", /application\/json/);
    expect(response.body).toHaveProperty("error", "unknown endpoint");
  });
});

describe("put route", () => {
  test("should replace a program correctly", async () => {
    const programsAtStart = await dataInDb();
    const oldProgram = programsAtStart.find(
      (program) => program.name === "Math Program",
    );
    const oldProgramId = oldProgram.id;
    const response = await api
      .put(`/api/programs/${oldProgramId}`)
      .send({ ...oldProgram, name: "SCAP" })
      .expect(200)
      .expect("Content-Type", /application\/json/);
    const programs = await dataInDb();
    expect(programs).toHaveLength(1);
    expect(programs[0]).toHaveProperty("name", "SCAP");
  });
  test("should return error when trying to replace a program that doesnt exist", async () => {
    const response = await api
      .put("/api/programs/dsfsdfs")
      .send({
        name: "joe",
      })
      .expect(404)
      .expect("Content-Type", /application\/json/);
  });
});

describe("post route", () => {
  test("should be able to create a new program", async () => {
    const response = await api
      .post("/api/programs/")
      .send(testDataList[1])
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(response.body.name).toContain("Science Program");
    const data = await dataInDb();
    expect(data).toHaveLength(2);
  });
  test("should return an error when not putting in required fields of a program", async () => {
    const response = await api
      .post("/api/programs/")
      .send({ ...testDataList[0], name: "" })
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });
});

describe("patch route", () => {
  test("should update a program correctly", async () => {
    const programsAtStart = await dataInDb();
    const oldProgram = programsAtStart.find(
      (program) => program.name === "Math Program",
    );
    const oldProgramId = oldProgram.id;
    const response = await api
      .patch(`/api/programs/${oldProgramId}`)
      .send({ ...oldProgram, name: "SCAP" })
      .expect(200)
      .expect("Content-Type", /application\/json/);
    const programs = await dataInDb();
    expect(programs).toHaveLength(1);
    expect(programs[0]).toHaveProperty("name", "SCAP");
  });
  test("should return error when trying to update a program that doesnt exist", async () => {
    const response = await api
      .patch("/api/programs/dsfsdfs")
      .send({ name: "joe" })
      .expect(404)
      .expect("Content-Type", /application\/json/);
  });
});

describe("delete route", () => {
  test("should delete a program correctly", async () => {
    const programsAtStart = await dataInDb();
    const oldProgram = programsAtStart.find(
      (program) => program.name === "Math Program",
    );
    const oldProgramId = oldProgram.id;
    const response = await api
      .delete(`/api/programs/${oldProgramId}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    const programs = await dataInDb();
    expect(programs).toHaveLength(0);
  });
  test("should return error when trying to delete a program that doesnt exist", async () => {
    const response = await api
      .delete("/api/programs/64bd2e5ee9849c40cdb84199")
      .expect(404)
      .expect("Content-Type", /application\/json/);
  });
});

afterAll(async () => {
  //remove any open handles so jest will shutdown properly
  await mongoose.connection.close();
  server.close();
});
