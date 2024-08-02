const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server");
const Project = require("../models/Project");
const Board = require("../models/Board");
const Task = require("../models/Task");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const mongoose = require("mongoose");

process.env.NODE_ENV = "test";

chai.use(chaiHttp);
const expect = chai.expect;

describe("Project API", () => {
  before(async function () {
    this.timeout(10000); // Increase the timeout to 10 seconds

    // Delete all documents from the users collection
    await User.deleteMany({});

    // Create the test user
    const hashedPassword = await bcrypt.hash("password", 10);
    await User.create({
      email: "testuser@example.com",
      username: "testuser",
      password: hashedPassword,
      first_name: "Test",
      last_name: "User",
    });

    // Generate the authentication token for the test user
    const res = await chai.request(app).post("/api/auth/login").send({
      email: "testuser@example.com",
      password: "password",
    });
    authToken = res.body.access_token;

    beforeEach(async () => {
      // Clear the database before each test
      await Project.deleteMany({});
      await Board.deleteMany({});
      await Task.deleteMany({});
    });
  });

  describe("POST /api/project/projects/", () => {
    it("should create a new project", async () => {
      const res = await chai
        .request(app)
        .post("/api/project/projects")
        .set("Authorization", `${authToken}`)
        .send({
          name: "Project Name", // Add the project name here
          description: "Project Description", // Add the project description here
          members: [],
          priority: "high",
          deadline: new Date(),
        });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("_id");
      expect(res.body.name).to.equal("string");
      expect(res.body.description).to.equal("string");
      expect(res.body.status).to.equal("new");
      expect(res.body.members).to.be.an("array").that.is.empty;
      expect(res.body.priority).to.equal("high");
      expect(res.body.deadline).to.be.a("string");
      expect(res.body.createdBy).to.be.a("string");
      expect(res.body.boards).to.be.an("array").that.is.not.empty;
      expect(res.body.boards[0]).to.have.property("_id");
      expect(res.body.boards[0].name).to.equal("Kanban Board");
      expect(res.body.boards[0].tasks).to.be.an("array").that.is.empty;
    });

    it("should return an error if required fields are missing", async () => {
      const res = await chai
        .request(app)
        .post("/api/project/projects")
        .set("Authorization", `${authToken}`)
        .send({});

      expect(res).to.have.status(500);
      expect(res.body).to.have.property("error");
    });
  });

  describe("GET /api/project/projects", () => {
    it("should return all projects", async () => {
      await Project.create({
        name: "Test Project 1",
        description: "This is a test project 1",
        members: [],
        priority: "high",
        deadline: new Date(),
      });
      await Project.create({
        name: "Test Project 2",
        description: "This is a test project 2",
        members: [],
        priority: "low",
        deadline: new Date(),
      });

      const res = await chai
        .request(app)
        .get("/api/project/projects")
        .set("Authorization", `${authToken}`);

      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array").that.has.lengthOf(2);
      expect(res.body[0]).to.have.property("_id");
      expect(res.body[0].name).to.equal("Test Project 1");
      expect(res.body[0].description).to.equal("This is a test project 1");
      expect(res.body[0].status).to.equal("new");
      expect(res.body[0].members).to.be.an("array").that.is.empty;
      expect(res.body[0].priority).to.equal("high");
      expect(res.body[0].deadline).to.be.a("string");
      expect(res.body[0].createdBy).to.be.a("string");
      expect(res.body[0].boards).to.be.an("array").that.is.not.empty;
      expect(res.body[0].boards[0]).to.have.property("_id");
      expect(res.body[0].boards[0].name).to.equal("Kanban Board");
      expect(res.body[0].boards[0].tasks).to.be.an("array").that.is.empty;
    });
  });

  describe("GET /api/project/projects/:id", () => {
    it("should return a project by ID", async () => {
      const project = await Project.create({
        name: "Test Project",
        description: "This is a test project",
        members: [],
        priority: "high",
        deadline: new Date(),
      });

      const res = await chai
        .request(app)
        .get(`/api/project/projects/${project._id}`)
        .set("Authorization", `${authToken}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("_id");
      expect(res.body.name).to.equal("Test Project");
      expect(res.body.description).to.equal("This is a test project");
      expect(res.body.status).to.equal("new");
      expect(res.body.members).to.be.an("array").that.is.empty;
      expect(res.body.priority).to.equal("high");
      expect(res.body.deadline).to.be.a("string");
      expect(res.body.createdBy).to.be.a("string");
      expect(res.body.boards).to.be.an("array").that.is.not.empty;
      expect(res.body.boards[0]).to.have.property("_id");
      expect(res.body.boards[0].name).to.equal("Kanban Board");
      expect(res.body.boards[0].tasks).to.be.an("array").that.is.empty;
    });

    it("should return an error if project ID is invalid", async () => {
      const res = await chai
        .request(app)
        .get("/api/project/projects/invalid-id")
        .set("Authorization", `${authToken}`);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property("error");
    });

    it("should return an error if project is not found", async () => {
      const res = await chai
        .request(app)
        .get(`/api/project/projects/${mongoose.Types.ObjectId()}`)
        .set("Authorization", `${authToken}`);

      expect(res).to.have.status(404);
      expect(res.body).to.have.property("error");
    });
  });

  describe("PUT /api/project/projects/:id", () => {
    it("should update a project by ID", async () => {
      const project = await Project.create({
        name: "Test Project",
        description: "This is a test project",
        members: [],
        priority: "high",
        deadline: new Date(),
      });

      const res = await chai
        .request(app)
        .put(`/api/project/projects/${project._id}`)
        .set("Authorization", `${authToken}`)
        .send({
          name: "Updated Test Project",
          description: "This is an updated test project",
          members: [],
          priority: "low",
          deadline: new Date(),
        });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("_id");
      expect(res.body.name).to.equal("Updated Test Project");
      expect(res.body.description).to.equal("This is an updated test project");
      expect(res.body.status).to.equal("new");
      expect(res.body.members).to.be.an("array").that.is.empty;
      expect(res.body.priority).to.equal("low");
      expect(res.body.deadline).to.be.a("string");
      expect(res.body.createdBy).to.be.a("string");
      expect(res.body.boards).to.be.an("array").that.is.not.empty;
      expect(res.body.boards[0]).to.have.property("_id");
      expect(res.body.boards[0].name).to.equal("Kanban Board");
      expect(res.body.boards[0].tasks).to.be.an("array").that.is.empty;
    });

    it("should return an error if project ID is invalid", async () => {
      const res = await chai
        .request(app)
        .put("/api/project/projects/invalid-id")
        .set("Authorization", `${authToken}`)
        .send({});

      expect(res).to.have.status(400);
      expect(res.body).to.have.property("error");
    });

    it("should return an error if project is not found", async () => {
      const res = await chai
        .request(app)
        .put(`/api/project/projects/${mongoose.Types.ObjectId()}`)
        .set("Authorization", `${authToken}`)
        .send({});

      expect(res).to.have.status(404);
      expect(res.body).to.have.property("error");
    });
  });

  describe("DELETE /api/project/projects/:id", () => {
    it("should delete a project by ID", async () => {
      const project = await Project.create({
        name: "Test Project",
        description: "This is a test project",
        members: [],
        priority: "high",
        deadline: new Date(),
      });

      const res = await chai
        .request(app)
        .delete(`/api/project/projects/${project._id}`)
        .set("Authorization", `${authToken}`);

      expect(res).to.have.status(204);

      const deletedProject = await Project.findById(project._id);
      expect(deletedProject).to.be.null;

      const deletedBoard = await Board.findOne({ project: project._id });
      expect(deletedBoard).to.be.null;

      const deletedTasks = await Task.find({ project: project._id });
      expect(deletedTasks).to.be.an("array").that.is.empty;
    });

    it("should return an error if project ID is invalid", async () => {
      const res = await chai
        .request(app)
        .delete("/api/project/projects/invalid-id")
        .set("Authorization", `${authToken}`);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property("error");
    });

    it("should return an error if project is not found", async () => {
      const res = await chai
        .request(app)
        .delete(`/api/project/projects/${mongoose.Types.ObjectId()}`)
        .set("Authorization", `${authToken}`);

      expect(res).to.have.status(404);
      expect(res.body).to.have.property("error");
    });
  });
});
