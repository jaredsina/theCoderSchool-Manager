const mongoose = require("mongoose");
const supertest = require("supertest");
const User = require("../models/user");
const { server, app } = require("../index");

const api = supertest(app);

// beforeEach should create a user to test login
beforeEach(async () => {
  await User.deleteMany({});
  await api.post("/api/users/").send({
    username: "testUser",
    name: "Test User",
    password: "testPassword",
  });
});

test("user should be able to login", async () => {
  const response = await api
    .post("/api/login")
    .send({ username: "testUser", password: "testPassword" })
    .expect(200)
    .expect("Content-Type", /application\/json/);
  expect(response.body.token).toBeDefined();
});

test("should return 401 if password is incorrect", async () => {
  const response = await api
    .post("/api/login")
    .send({ username: "testUser", password: "wrongPassword" })
    .expect(401)
    .expect("Content-Type", /application\/json/);
  expect(response.body.error).toBe("invalid username or password");
});

test("should return 401 if username is incorrect", async () => {
  const response = await api
    .post("/api/login")
    .send({ username: "wrongUser", password: "testPassword" })
    .expect(401)
    .expect("Content-Type", /application\/json/);
  expect(response.body.error).toBe("invalid username or password");
});

// closes the server and database connection after all tests
afterAll(() => {
  mongoose.connection.close();
  server.close();
});
