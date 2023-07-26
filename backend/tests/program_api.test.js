// allows us to make requests to our express app
const supertest = require("supertest");
const { app, server } = require("../index");

const api = supertest(app);

// to close the connection to the database
const mongoose = require("mongoose");

const Program = require("../models/program");
const User = require("../models/user");
const { testDataList, dataInDb } = require("./testHelper_program_api");

// token for authentication
let token;

// reset test db for consistent results
// in these tests the user has successfully logged in and has a token
beforeEach(async () => {
  await Program.deleteMany({});
  const uploadedProgram = await Program.create(testDataList[0]);
  await User.deleteMany({});

  // create user
  await api
    .post("/api/users")
    .send({
      username: "testUser",
      name: "Test User",
      password: "testPassword",
    })
    .expect(200)
    .expect("Content-Type", /application\/json/);

  // login user
  const response = await api
    .post("/api/login")
    .send({ username: "testUser", password: "testPassword" })
    .expect(200)
    .expect("Content-Type", /application\/json/);
  token = response.body.token;
});

describe("get route", () => {
  test("should return a program", async () => {
    const response = await api
      .get("/api/programs/")
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(response.body).toHaveLength(1);
  });
  test("should return an error with incorrect endpoint", async () => {
    const response = await api
      .get("/api/program/")
      .set("Authorization", `bearer ${token}`)
      .expect(404)
      .expect("Content-Type", /application\/json/);
    expect(response.body).toHaveProperty("error", "unknown endpoint");
  });
  test("should return a single program", async () => {
    const programsAtStart = await dataInDb();
    const foundProgram = programsAtStart[0];
    const response = await api
      .get(`/api/programs/${foundProgram.id}`)
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(response.body).toHaveProperty("name", "Math Program");
  });
  test("should return an error when trying to get a program that doesnt exist", async () => {
    const response = await api
      .get("/api/programs/64bd2e5ee9849c40cdb84199")
      .set("Authorization", `bearer ${token}`)
      .expect(404)
      .expect("Content-Type", /application\/json/);
    expect(response.body).toHaveProperty("error", "Program was not found");
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
      .set("Authorization", `bearer ${token}`)
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
      .set("Authorization", `bearer ${token}`)
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
      .set("Authorization", `bearer ${token}`)
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
      .set("Authorization", `bearer ${token}`)
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
      .set("Authorization", `bearer ${token}`)
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
      .set("Authorization", `bearer ${token}`)
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
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    const programs = await dataInDb();
    expect(programs).toHaveLength(0);
  });
  test("should return error when trying to delete a program that doesnt exist", async () => {
    const response = await api
      .delete("/api/programs/64bd2e5ee9849c40cdb84199")
      .set("Authorization", `bearer ${token}`)
      .expect(404)
      .expect("Content-Type", /application\/json/);
  });
  test("should return cast error when trying to delete a program with invalid id", async () => {
    // test response for cast error
    const response = await api
      .delete("/api/programs/64bd2e5ee9849c4")
      .set("Authorization", `bearer ${token}`)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    expect(response.body).toHaveProperty("error", "malformatted id");
  });
});

afterAll(async () => {
  // remove any open handles so jest will shutdown properly
  await mongoose.connection.close();
  server.close();
});
