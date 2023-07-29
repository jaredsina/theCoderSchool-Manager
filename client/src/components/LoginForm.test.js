import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../utils/test-utils";
import LoginForm from "./LoginForm";
import "@testing-library/jest-dom";

// We use msw to intercept the network request during the test,
// and return the response test,12345,Test User after 150ms
// when receiving a post request to the `/api/login` endpoint
export const handlers = [
  rest.post("http://localhost:3000/api/login", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ username: "test", token: "12345", name: "Test User" }),
      ctx.delay(150),
    );
  }),
];

const server = setupServer(...handlers);

//Enable API mocking before tests.
beforeAll(() => server.listen());

//Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

//Disable API mocking after the tests are done.
afterAll(() => server.close());

test("renders login form", () => {
  renderWithProviders(<LoginForm />);
  expect(screen.getByText("Login Form")).toBeInTheDocument();
});
test("calls onSubmit with correct details", async () => {
  renderWithProviders(<LoginForm />);
  const usernameInput = screen.getByPlaceholderText("username");
  const passwordInput = screen.getByPlaceholderText("password");
  const submitButton = screen.getByText("Login");
  fireEvent.change(usernameInput, { target: { value: "test" } });
  fireEvent.change(passwordInput, { target: { value: "password" } });
  fireEvent.click(submitButton);
});
test("renders notification on successful login", async () => {
  renderWithProviders(<LoginForm />);
  const usernameInput = screen.getByPlaceholderText("username");
  const passwordInput = screen.getByPlaceholderText("password");
  const submitButton = screen.getByText("Login");
  fireEvent.change(usernameInput, { target: { value: "test" } });
  fireEvent.change(passwordInput, { target: { value: "password" } });
  fireEvent.click(submitButton);
  await waitFor(() => {
    expect(screen.getByText("Welcome test")).toBeInTheDocument();
  });
});
test("renders notification on failed login", async () => {
  server.use(
    rest.post("http://localhost:3000/api/login", (req, res, ctx) => {
      return res(ctx.status(401), ctx.json({ error: "Invalid credentials" }));
    }),
  );
  renderWithProviders(<LoginForm />);
  const usernameInput = screen.getByPlaceholderText("username");
  const passwordInput = screen.getByPlaceholderText("password");
  const submitButton = screen.getByText("Login");
  fireEvent.change(usernameInput, { target: { value: "test" } });
  fireEvent.change(passwordInput, { target: { value: "password" } });
  fireEvent.click(submitButton);
  await waitFor(() => {
    expect(
      screen.getByText("Invalid username or password"),
    ).toBeInTheDocument();
  });
});
