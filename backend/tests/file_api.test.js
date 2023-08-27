const supertest = require("supertest");
const { app, server } = require("../index");

const api = supertest(app);

const mongoose = require("mongoose");
const User = require("../models/user");
const File = require("../models/file");

let token;

beforeAll(async () => {
  await User.deleteMany({});

  // create a new user
  const newUser = {
    username: "testuser",
    name: "Test User",
    password: "testpassword",
  };

  // create a new user on the database
  await api.post("/api/users").send(newUser);

  // login the user and get the token
  const response = await api.post("/api/login").send(newUser);
  token = response.body.token;
});

describe("post route", () => {});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});
