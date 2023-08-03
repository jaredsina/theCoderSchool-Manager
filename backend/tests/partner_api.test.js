const mongoose = require("mongoose");
const supertest = require("supertest");
const Partner = require("../models/partner");
const { app, server } = require("../index");
const User = require("../models/user");

const api = supertest(app);

const initialPartners = [
  {
    name: "Partner 1",
  },
];

// token for authentication
let token;

afterAll(async () => {
  // remove any open handles so jest will shutdown properly
  await mongoose.connection.close();
  server.close();
});

// reset test db for consistent results
// in these tests the user has successfully logged in and has a token
beforeEach(async () => {
  await Partner.deleteMany({});
  const uploadedProgram = await Partner.create(initialPartners[0]);
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
  test("should return a partner", async () => {
    const response = await api
      .get("/api/partners/")
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(response.body).toHaveLength(1);
  });
  test("should return an error with incorrect endpoint", async () => {
    const response = await api
      .get("/api/partner/")
      .set("Authorization", `bearer ${token}`)
      .expect(404)
      .expect("Content-Type", /application\/json/);
    expect(response.body).toHaveProperty("error", "unknown endpoint");
  });
  test("should return a single partner", async () => {
    const response = await api
      .get("/api/partners/")
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(response.body[0].name).toBe("Partner 1");
  });
});

describe("post route", () => {
  test("should create a new partner", async () => {
    const newPartner = {
      name: "Partner 2",
    };
    await api
      .post("/api/partners/")
      .set("Authorization", `bearer ${token}`)
      .send(newPartner)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    const response = await api
      .get("/api/partners/")
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(response.body).toHaveLength(2);
    expect(response.body[1].name).toBe("Partner 2");
  });
  test("should return an error with missing name", async () => {
    const newPartner = {};
    const response = await api
      .post("/api/partners/")
      .set("Authorization", `bearer ${token}`)
      .send(newPartner)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });
});

describe("put route", () => {
  test("should update a partner", async () => {
    const newPartner = {
      name: "Partner 2",
    };
    // get existing partner
    const response = await api
      .get("/api/partners/")
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    const { id } = response.body[0];
    // update the partner
    await api
      .put(`/api/partners/${id}`)
      .set("Authorization", `bearer ${token}`)
      .send({ ...newPartner, id })
      .expect(200)
      .expect("Content-Type", /application\/json/);
    // check that the partner was updated
    const updatedResponse = await api
      .get("/api/partners/")
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(updatedResponse.body[0].name).toBe("Partner 2");
  });
  test("should return an error with missing name", async () => {
    const newPartner = {};

    // get the id of the partner
    const response = await api
      .get("/api/partners/")
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    const { id } = response.body[0];
    // update the partner
    await api
      .put(`/api/partners/${id}`)
      .set("Authorization", `bearer ${token}`)
      .send({ ...newPartner, id })
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });
  test("should return an error with incorrect id", async () => {
    const newPartner = {
      name: "Partner 2",
    };
    // update the partner
    await api
      .put(`/api/partners/123`)
      .set("Authorization", `bearer ${token}`)
      .send({ ...newPartner, id: 123 })
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });
});

describe("delete route", () => {
  test("should delete a partner", async () => {
    // get the id of the partner
    const response = await api
      .get("/api/partners/")
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    const { id } = response.body[0];
    // delete the partner
    await api
      .delete(`/api/partners/${id}`)
      .set("Authorization", `bearer ${token}`)
      .expect(200);
    // check that the partner was deleted
    const updatedResponse = await api
      .get("/api/partners/")
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(updatedResponse.body).toHaveLength(0);
  });
  test("should return an error with incorrect id", async () => {
    // delete the partner
    await api
      .delete(`/api/partners/123`)
      .set("Authorization", `bearer ${token}`)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });
  test("should return an error when trying to delete a program that doesn't exist", async () => {
    // delete the partner
    await api
      .delete(`/api/partners/5f9f9f9f9f9f9f9f9f9f9f9f`)
      .set("Authorization", `bearer ${token}`)
      .expect(404)
      .expect("Content-Type", /application\/json/);
  });
});
