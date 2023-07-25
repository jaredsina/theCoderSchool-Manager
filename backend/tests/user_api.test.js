const supertest = require("supertest");
const mongoose = require("mongoose");
const User = require("../models/user");
const { app, server } = require("../index");
const { testData, usersInDB } = require("./testHelper_user_api");

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  const newUser = new User({
    username: "testUser",
    name: "Test User",
    passwordHash: "testPassword",
  });
  await newUser.save();
});

describe("post route", () => {
  test("should create a new user", async () => {
    const usersAtStart = await usersInDB();
    const newUser = testData[0];
    await api
      .post("/api/users")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    const usersAtEnd = await usersInDB();
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1);
    const usernames = usersAtEnd.map((user) => user.username);
    expect(usernames).toContain(newUser.username);
  });
  test("should not create a new user if username is not unique", async () => {
    const usersAtStart = await usersInDB();
    const newUser = testData[0];
    newUser.username = "testUser";
    await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    const usersAtEnd = await usersInDB();
    expect(usersAtEnd.length).toBe(usersAtStart.length);
  });
});

describe("get route", () => {
  test("should return a single user", async () => {
    const usersAtStart = await usersInDB();
    const userToGet = usersAtStart[0];
    const response = await api
      .get(`/api/users/${userToGet.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(response.body).toEqual(userToGet);
  });
  test("should return 404 if user does not exist", async () => {
    const usersAtStart = await usersInDB();
    const userToGet = usersAtStart[0];
    await User.findByIdAndDelete(userToGet.id);
    await api
      .get(`/api/users/${userToGet.id}`)
      .expect(404)
      .expect("Content-Type", /application\/json/);
  });
});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});
