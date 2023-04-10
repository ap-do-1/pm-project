import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:4000/api", // Replace with your backend API endpoint
  headers: {
    Accept: "application/json",
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
};
