const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const expect = chai.expect;
const Task = require("../models/Task");

process.env.NODE_ENV = "test";

chai.use(chaiHttp);

describe("Task Controller", () => {
  beforeEach(async () => {
    // Clear the database before each test
    await Task.deleteMany();
  });

  describe("GET /api/task/tasks", () => {
    it("should get all tasks", async () => {
      // Create test tasks
      const task1 = new Task({
        name: "Task 1",
        description: "Description 1",
        due_date: new Date(),
        assigned_to: "User 1",
        creator: "User 2",
        status: "In Progress",
        priority: "High",
      });
      await task1.save();

      const task2 = new Task({
        name: "Task 2",
        description: "Description 2",
        due_date: new Date(),
        assigned_to: "User 2",
        creator: "User 1",
        status: "Completed",
        priority: "Low",
      });
      await task2.save();

      const response = await chai.request(server).get("/api/task/tasks");

      expect(response).to.have.status(200);
      expect(response.body).to.be.an("array");
      expect(response.body).to.have.lengthOf(2);

      const taskNames = response.body.map((task) => task.name);
      expect(taskNames).to.include.members(["Task 1", "Task 2"]);
    });
  });

  describe("GET /api/task/tasks/:id", () => {
    it("should get a single task", async () => {
      // Create a test task
      const task = new Task({
        name: "Test Task",
        description: "Test Description",
        due_date: new Date(),
        assigned_to: "User 1",
        creator: "User 2",
        status: "In Progress",
        priority: "High",
      });
      await task.save();

      const response = await chai
        .request(server)
        .get(`/api/task/tasks/${task._id}`);

      expect(response).to.have.status(200);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("name", "Test Task");
      expect(response.body).to.have.property("description", "Test Description");
    });

    it("should return an error if the task is not found", async () => {
      const response = await chai
        .request(server)
        .get("/api/task/tasks/1234567890");

      expect(response).to.have.status(404);
      expect(response.body).to.have.property("error", "Task not found.");
    });
  });

  describe("POST /api/task/tasks", () => {
    it("should create a new task", async () => {
      const response = await chai.request(server).post("/api/task/tasks").send({
        name: "Test Task",
        description: "Test Description",
        due_date: new Date(),
        assigned_to: "User 1",
        creator: "User 2",
        status: "In Progress",
        priority: "High",
      });

      expect(response).to.have.status(201);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("name", "Test Task");
      expect(response.body).to.have.property("description", "Test Description");
    });
  });

  describe("PUT /api/task/tasks/:id", () => {
    it("should update a task", async () => {
      // Create a test task
      const task = new Task({
        name: "Test Task",
        description: "Test Description",
        due_date: new Date(),
        assigned_to: "User 1",
        creator: "User 2",
        status: "In Progress",
        priority: "High",
      });
      await task.save();

      const response = await chai
        .request(server)
        .put(`/api/task/tasks/${task._id}`)
        .send({ name: "Updated Task", description: "Updated Description" });

      expect(response).to.have.status(200);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("name", "Updated Task");
      expect(response.body).to.have.property(
        "description",
        "Updated Description"
      );
    });

    it("should return an error if the task is not found", async () => {
      const response = await chai
        .request(server)
        .put("/api/task/tasks/1234567890")
        .send({ name: "Updated Task" });

      expect(response).to.have.status(404);
      expect(response.body).to.have.property("error", "Task not found.");
    });
  });

  describe("DELETE /api/task/tasks/:id", () => {
    it("should delete a task", async () => {
      // Create a test task
      const task = new Task({
        name: "Test Task",
        description: "Test Description",
        due_date: new Date(),
        assigned_to: "User 1",
        creator: "User 2",
        status: "In Progress",
        priority: "High",
      });
      await task.save();

      const response = await chai
        .request(server)
        .delete(`/api/task/tasks/${task._id}`);

      expect(response).to.have.status(204);

      // Check if the task is deleted from the database
      const deletedTask = await Task.findById(task._id);
      expect(deletedTask).to.be.null;
    });

    it("should return an error if the task is not found", async () => {
      const response = await chai
        .request(server)
        .delete("/api/task/tasks/1234567890");

      expect(response).to.have.status(404);
      expect(response.body).to.have.property("error", "Task not found.");
    });
  });

  describe("DELETE /api/task/tasks", () => {
    it("should delete all tasks", async () => {
      // Create test tasks
      const task1 = new Task({
        name: "Task 1",
        description: "Description 1",
        due_date: new Date(),
        assigned_to: "User 1",
        creator: "User 2",
        status: "In Progress",
        priority: "High",
      });
      await task1.save();

      const task2 = new Task({
        name: "Task 2",
        description: "Description 2",
        due_date: new Date(),
        assigned_to: "User 2",
        creator: "User 1",
        status: "Completed",
        priority: "Low",
      });
      await task2.save();

      const response = await chai.request(server).delete("/api/task/tasks");

      expect(response).to.have.status(204);

      // Check if all tasks are deleted from the database
      const deletedTasks = await Task.find();
      expect(deletedTasks).to.have.lengthOf(0);
    });
  });
});
