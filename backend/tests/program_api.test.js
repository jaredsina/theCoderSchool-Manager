// allows us to make requests to our express app
const supertest = require("supertest");
const { app, server } = require("../index");

const api = supertest(app);

// to close the connection to the database
const mongoose = require("mongoose");

const Program = require("../models/program");
const User = require("../models/user");
const { testDataList, dataInDb } = require("./testHelper_program_api");
const Partner = require("../models/partner");

// token for authentication
let token;

// reset test db for consistent results
// in these tests the user has successfully logged in and has a token
beforeEach(async () => {
  // setup partners for testing
  await Partner.deleteMany({});
  const uploadedPartner = await Partner.create({ name: "Test Partner" });
  await Partner.create({ name: "Test Partner 2" });
  testDataList[0].partner = uploadedPartner.id;
  // set partner name
  testDataList[0].partnerName = uploadedPartner.name;
  // setup programs for testing
  await Program.deleteMany({});
  const uploadedProgram = await Program.create(testDataList[0]);

  // set up users for testing
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
  test("should properly update the partner of a program", async () => {
    // get starting partners
    const partnersAtStart = await Partner.find({});
    // get partner id to post a new program to
    const partnerToUpdate = partnersAtStart.find(
      (partner) => partner.name === "Test Partner 2",
    );
    // post a new program
    const response = await api
      .post("/api/programs/")
      .set("Authorization", `bearer ${token}`)
      .send({ ...testDataList[1], partner: partnerToUpdate.id })
      .expect(200)
      .expect("Content-Type", /application\/json/);
    // check that the program has the correct partner
    expect(response.body).toHaveProperty("partner", partnerToUpdate.id);
  });

  test("updating a programs partner should add it to the new partners programs", async () => {
    // get starting partners
    const partnersAtStart = await Partner.find({});
    // get partner id to post a new program to
    const partnerToUpdate = partnersAtStart.find(
      (partner) => partner.name === "Test Partner 2",
    );
    // get partner id of other partner to update the program to
    const partnerToUpdate2 = partnersAtStart.find(
      (partner) => partner.name === "Test Partner",
    );

    // post a new program to the partner
    const response = await api
      .post("/api/programs/")
      .set("Authorization", `bearer ${token}`)
      .send({ ...testDataList[1], partner: partnerToUpdate.id })
      .expect(200)
      .expect("Content-Type", /application\/json/);
    // get updated partner
    const updatedPartner = await Partner.findById(partnerToUpdate.id);
    // check that the new program was added to the partner
    expect(updatedPartner.programs).toHaveLength(1);

    // update the posted program with a different partner
    const programToUpdate = response.body;
    const response2 = await api
      .put(`/api/programs/${programToUpdate.id}`)
      .set("Authorization", `bearer ${token}`)
      .send({ ...programToUpdate, partner: partnerToUpdate2.id })
      .expect(200)
      .expect("Content-Type", /application\/json/);
    // get updated partner
    const updatedPartner2 = await Partner.findById(partnerToUpdate2.id);
    // check that the new program was added to the partner
    expect(updatedPartner2.programs).toHaveLength(1);
  });
  test("updating a programs partner should remove it from the old partners programs", async () => {
    // get starting partners
    const partnersAtStart = await Partner.find({});
    // get partner id to post a new program to
    const oldPartner = partnersAtStart.find(
      (partner) => partner.name === "Test Partner 2",
    );
    // get partner id of other partner to update the program to
    const newPartner = partnersAtStart.find(
      (partner) => partner.name === "Test Partner",
    );

    // post a new program to the partner
    const response = await api
      .post("/api/programs/")
      .set("Authorization", `bearer ${token}`)
      .send({ ...testDataList[1], partner: oldPartner.id })
      .expect(200)
      .expect("Content-Type", /application\/json/);
    // get updated partner
    const updatedPartner = await Partner.findById(oldPartner.id);
    // check that the new program was added to the partner
    expect(updatedPartner.programs).toHaveLength(1);

    // update the posted program with a different partner
    const programToUpdate = response.body;
    const response2 = await api
      .put(`/api/programs/${programToUpdate.id}`)
      .set("Authorization", `bearer ${token}`)
      .send({ ...programToUpdate, partner: newPartner.id })
      .expect(200)
      .expect("Content-Type", /application\/json/);
    // check that the old partner no longer has the program
    const oldPartnerv2 = await Partner.findById(oldPartner.id);
    expect(oldPartnerv2.programs).toHaveLength(0);
  });
  test("updating a null partner to a program should successfully update the program", async () => {
    // get starting partners
    const partnersAtStart = await Partner.find({});
    // get partner id to post a new program to
    const oldPartner = partnersAtStart.find(
      (partner) => partner.name === "Test Partner 2",
    );

    // post a new program to the partner
    const response = await api
      .post("/api/programs/")
      .set("Authorization", `bearer ${token}`)
      .send({ ...testDataList[1], partner: oldPartner.id })
      .expect(200)
      .expect("Content-Type", /application\/json/);
    // get updated partner
    const updatedPartner = await Partner.findById(oldPartner.id);
    // check that the new program was added to the partner
    expect(updatedPartner.programs).toHaveLength(1);

    // update the posted program with a different partner
    const programToUpdate = response.body;
    const response2 = await api
      .put(`/api/programs/${programToUpdate.id}`)
      .set("Authorization", `bearer ${token}`)
      .send({ ...programToUpdate, partner: null })
      .expect(200)
      .expect("Content-Type", /application\/json/);
    // check that the old partner no longer has the program
    const oldPartnerv2 = await Partner.findById(oldPartner.id);
    expect(oldPartnerv2.programs).toHaveLength(0);
  });
  test("updating a program with a partner to a null partner should successfully update the program", async () => {
    // get starting partners
    const partnersAtStart = await Partner.find({});
    // get partner id to post a new program to
    const oldPartner = partnersAtStart.find(
      (partner) => partner.name === "Test Partner 2",
    );

    // post a new program to the partner
    const response = await api
      .post("/api/programs/")
      .set("Authorization", `bearer ${token}`)
      .send({ ...testDataList[1], partner: null })
      .expect(200)
      .expect("Content-Type", /application\/json/);
    // get updated partner
    const updatedPartner = await Partner.findById(oldPartner.id);
    // check that the new program was added to the partner
    expect(updatedPartner.programs).toHaveLength(0);

    // update the posted program with a different partner
    const programToUpdate = response.body;
    const response2 = await api
      .put(`/api/programs/${programToUpdate.id}`)
      .set("Authorization", `bearer ${token}`)
      .send({ ...programToUpdate, partner: oldPartner.id })
      .expect(200)
      .expect("Content-Type", /application\/json/);
    // check that the old partner no longer has the program
    const oldPartnerv2 = await Partner.findById(oldPartner.id);
    expect(oldPartnerv2.programs).toHaveLength(1);
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
  test("should properly save a partner to a program", async () => {
    const response = await api
      .post("/api/programs/")
      .set("Authorization", `bearer ${token}`)
      .send(testDataList[0])
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(response.body.partner).toBeDefined();
  });
  test("should properly add the partner name to the program", async () => {
    const response = await api
      .post("/api/programs/")
      .set("Authorization", `bearer ${token}`)
      .send(testDataList[0])
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(response.body.partnerName).toContain("Test Partner");
  });
  test("should properly add the program to the partners program list", async () => {
    // lets grab the existing partners
    const partnersAtStart = await Partner.find({});
    // let grab the id of the first partner
    const partnerId = partnersAtStart[0].id;
    // lets post a new program with the partner id
    const response = await api
      .post("/api/programs/")
      .set("Authorization", `bearer ${token}`)
      .send({ ...testDataList[0], partner: partnerId })
      .expect(200)
      .expect("Content-Type", /application\/json/);
    // lets grab the partner again
    const partnerAtEnd = await Partner.findById(partnerId);

    // lets check if the program was added to the partners program list
    expect(partnerAtEnd.programs[0].toString()).toBe(response.body.id);
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
  test("should properly update the partner of a program", async () => {
    const programsAtStart = await dataInDb();
    const oldProgram = programsAtStart.find(
      (program) => program.name === "Math Program",
    );
    const oldProgramId = oldProgram.id;
    const response = await api
      .patch(`/api/programs/${oldProgramId}`)
      .set("Authorization", `bearer ${token}`)
      .send({ ...oldProgram, partner: "5f9f9b6a5e4b0d3e0c9a3e4b" })
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(response.body.partner).toBe("5f9f9b6a5e4b0d3e0c9a3e4b");
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
