const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server");
const User = require("../models/User");
const expect = chai.expect;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

process.env.NODE_ENV = "test";

chai.use(chaiHttp);

describe("Auth Controller", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("POST /api/auth/register", () => {
    it("should return 422 if any required fields are missing", async () => {
      const res = await chai.request(app).post("/api/auth/register").send({});
      expect(res).to.have.status(422);
    });

    it("should return 422 if passwords do not match", async () => {
      const res = await chai.request(app).post("/api/auth/register").send({
        username: "testuser",
        email: "testuser@example.com",
        first_name: "Test",
        last_name: "User",
        password: "password",
        password_confirm: "notmatching",
      });
      expect(res).to.have.status(422);
    });

    it("should return 409 if user already exists", async () => {
      await User.create({
        email: "testuser@example.com",
        username: "testuser",
        password: "password",
        first_name: "Test",
        last_name: "User",
      });
      const res = await chai.request(app).post("/api/auth/register").send({
        username: "testuser",
        email: "testuser@example.com",
        first_name: "Test",
        last_name: "User",
        password: "password",
        password_confirm: "password",
      });
      expect(res).to.have.status(409);
    });

    it("should create a new user if all fields are valid", async () => {
      const res = await chai.request(app).post("/api/auth/register").send({
        username: "testuser",
        email: "testuser@example.com",
        first_name: "Test",
        last_name: "User",
        password: "password",
        password_confirm: "password",
      });
      expect(res).to.have.status(201);
      const user = await User.findOne({ email: "testuser@example.com" });
      expect(user).to.not.be.null;
      expect(user.username).to.equal("testuser");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should return 422 if any required fields are missing", async () => {
      const res = await chai.request(app).post("/api/auth/login").send({});
      expect(res).to.have.status(422);
    });

    it("should return 401 if email or password is incorrect", async () => {
      await User.create({
        email: "testuser@example.com",
        username: "testuser",
        password: await bcrypt.hash("password", 10),
        first_name: "Test",
        last_name: "User",
      });
      const res = await chai.request(app).post("/api/auth/login").send({
        email: "testuser@example.com",
        password: "wrongpassword",
      });
      expect(res).to.have.status(401);
    });

    it("should return an access token if email and password are correct", async () => {
      const hashedPassword = await bcrypt.hash("password", 10);
      await User.create({
        email: "testuser@example.com",
        username: "testuser",
        password: hashedPassword,
        first_name: "Test",
        last_name: "User",
      });
      const res = await chai.request(app).post("/api/auth/login").send({
        email: "testuser@example.com",
        password: "password",
      });
      expect(res).to.have.status(200);
      expect(res.body.access_token).to.not.be.null;
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should return 204 if user is not logged in", async () => {
      const res = await chai.request(app).post("/api/auth/logout");
      expect(res).to.have.status(204);
    });
  });
});
