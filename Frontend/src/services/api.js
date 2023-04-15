import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:4000/api", // Replace with your backend API endpoint
  headers: {
    "Content-Type": "application/json",
  },
});

export default {
  async getProjects() {
    return await apiClient.get("/projects");
  },
  async getProjectById(id) {
    return await apiClient.get(`/projects/${id}`);
  },
  async createProject(project) {
    return await apiClient.post("/projects", project);
  },
  async updateProject(id, project) {
    return await apiClient.put(`/projects/${id}`, project);
  },
  async deleteProject(id) {
    return await apiClient.delete(`/projects/${id}`);
  },

  async getTasks() {
    return await apiClient.get("/tasks");
  },
  async getTaskById(id) {
    return await apiClient.get(`/tasks/${id}`);
  },
  async createTask(task) {
    return await apiClient.post("/tasks", task);
  },
  async updateTask(id, task) {
    return await apiClient.put(`/tasks/${id}`, task);
  },
  async deleteTask(id) {
    return await apiClient.delete(`/tasks/${id}`);
  },
};
