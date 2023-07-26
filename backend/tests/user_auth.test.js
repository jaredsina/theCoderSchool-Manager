// allows us to make requests to our express app
const supertest = require("supertest");
const { app, server } = require("../index");

const api = supertest(app);

// to close the connection to the database
const mongoose = require("mongoose");

const User = require("../models/user");
const { testDataList, dataInDb } = require("./testHelper_program_api");

describe("user authentication for program route", () => {
  // this describe block focuses on the user authentication and making sure routes are protected
  describe("no token provided", () => {
    test("should return 401 if no token is provided and trying to access post route", async () => {
      const response = await api
        .post("/api/programs/")
        .send(testDataList[1])
        .expect(401)
        .expect("Content-Type", /application\/json/);
      expect(response.body).toHaveProperty("error", "token missing");
    });
    test("should return 401 if no token is provided and trying to access put route", async () => {
      const programsAtStart = await dataInDb();
      const oldProgram = programsAtStart.find(
        (program) => program.name === "Math Program",
      );
      const oldProgramId = oldProgram.id;
      const response = await api
        .put(`/api/programs/${oldProgramId}`)
        .send({ ...oldProgram, name: "SCAP" })
        .expect(401)
        .expect("Content-Type", /application\/json/);
      expect(response.body).toHaveProperty("error", "token missing");
    });
    test("should return 401 if no token is provided and trying to access patch route", async () => {
      const programsAtStart = await dataInDb();
      const oldProgram = programsAtStart.find(
        (program) => program.name === "Math Program",
      );
      const oldProgramId = oldProgram.id;
      const response = await api
        .patch(`/api/programs/${oldProgramId}`)
        .send({ ...oldProgram, name: "SCAP" })
        .expect(401)
        .expect("Content-Type", /application\/json/);
      expect(response.body).toHaveProperty("error", "token missing");
    });
    test("should return 401 if no token is provided and trying to access delete route", async () => {
      const programsAtStart = await dataInDb();
      const oldProgram = programsAtStart.find(
        (program) => program.name === "Math Program",
      );
      const oldProgramId = oldProgram.id;
      const response = await api
        .delete(`/api/programs/${oldProgramId}`)
        .expect(401)
        .expect("Content-Type", /application\/json/);
      expect(response.body).toHaveProperty("error", "token missing");
    });
    test("should return 401 if no token is provided and trying to access get route", async () => {
      const response = await api
        .get("/api/programs/")
        .expect(401)
        .expect("Content-Type", /application\/json/);
      expect(response.body).toHaveProperty("error", "token missing");
    });
  });
  describe("invalid token", () => {
    let token;
    // create and login a user for each test
    beforeEach(async () => {
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

    // this describe block focsus on the user authentication and making sure routes are protected when a token is invalid
    test("should return 401 if token is invalid and trying to access post route", async () => {
      const response = await api
        .post("/api/programs/")
        .set("Authorization", `bearer ${token}123`)
        .send(testDataList[1])
        .expect(401)
        .expect("Content-Type", /application\/json/);
      expect(response.body).toHaveProperty("error", "invalid signature");
    });
    test("should return 401 if token is invalid and trying to access put route", async () => {
      const programsAtStart = await dataInDb();
      const oldProgram = programsAtStart.find(
        (program) => program.name === "Math Program",
      );
      const oldProgramId = oldProgram.id;
      const response = await api
        .put(`/api/programs/${oldProgramId}`)
        .set("Authorization", `bearer ${token}123`)
        .send({ ...oldProgram, name: "SCAP" })
        .expect(401)
        .expect("Content-Type", /application\/json/);
      expect(response.body).toHaveProperty("error", "invalid signature");
    });
    test("should return 401 if token is invalid and trying to access patch route", async () => {
      const programsAtStart = await dataInDb();
      const oldProgram = programsAtStart.find(
        (program) => program.name === "Math Program",
      );
      const oldProgramId = oldProgram.id;
      const response = await api
        .patch(`/api/programs/${oldProgramId}`)
        .set("Authorization", `bearer ${token}123`)
        .send({ ...oldProgram, name: "SCAP" })
        .expect(401)
        .expect("Content-Type", /application\/json/);
      expect(response.body).toHaveProperty("error", "invalid signature");
    });
    test("should return 401 if token is invalid and trying to access delete route", async () => {
      const programsAtStart = await dataInDb();
      const oldProgram = programsAtStart.find(
        (program) => program.name === "Math Program",
      );
      const oldProgramId = oldProgram.id;
      const response = await api
        .delete(`/api/programs/${oldProgramId}`)
        .set("Authorization", `bearer ${token}123`)
        .expect(401)
        .expect("Content-Type", /application\/json/);
      expect(response.body).toHaveProperty("error", "invalid signature");
    });
    test("should return 401 if token is invalid and trying to access get route", async () => {
      const response = await api
        .get("/api/programs/")
        .set("Authorization", `bearer ${token}123`)
        .expect(401)
        .expect("Content-Type", /application\/json/);
      expect(response.body).toHaveProperty("error", "invalid signature");
    });
  });

  describe("expired token", () => {
    // this test will test if a token is expired and the user is trying to access a protected route
    let token;
    // create and login a user for each test
    beforeEach(async () => {
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
    test("should return 401 if token is expired", async () => {
      // use jest fake timers to make the token expire
      jest.useFakeTimers();
      // advance the timers by 61 minutes
      jest.advanceTimersByTime(61 * 60 * 1000);
      // try to access a protected route
      const response = await api
        .get("/api/programs/")
        .set("Authorization", `bearer ${token}`)
        .expect(401)
        .expect("Content-Type", /application\/json/);
      expect(response.body).toHaveProperty("error", "token expired");
      // reset the timers
      jest.useRealTimers();
    });
  });
});

afterAll(async () => {
  // remove any open handles so jest will shutdown properly
  await mongoose.connection.close();
  server.close();
});
