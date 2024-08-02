// User Model
export interface User {
  _id: string
  username: string
  email: string
  first_name: string
  last_name: string
  password: string
  last_login: Date
  avatar: string
  refresh_token?: string
}

// Project Model
export interface Project {
  _id: string
  name: string
  description: string
  board: string // Board ID
  createdBy: string // Creator ID
  status: 'In progress' | 'Open' | 'Closed'
  members: string[] // Member IDs
  deadline: Date
  priority: 'Low' | 'Medium' | 'High'
  created_at: Date
  updated_at: Date
}

// Board Model
export interface Board {
  _id: string
  name: string
  project: string // Project ID
  creator: string // Creator ID
  members: string[] // Member IDs
  tasks: string[] // Task IDs
}

// Task Model
export interface Task {
  _id: string
  name: string
  description: string
  board: string // Board ID
  createdBy: string // Creator ID
  status: 'In progress' | 'Open' | 'Closed'
  assignees: string[] // Assignee IDs
  deadline: Date
  priority: 'Low' | 'Medium' | 'High'
  created_at: Date
  updated_at: Date
}

// Data types used in store actions

// Project Data
export interface ProjectData {
  name: string
  description: string
  board: string // Board ID
  createdBy: string // Creator ID
  status: 'In progress' | 'Open' | 'Closed'
  members: string[] // Member IDs
  deadline: Date
  priority: 'Low' | 'Medium' | 'High'
}

// Board Data
export interface BoardData {
  name: string
  project: string // Project ID
  creator: string // Creator ID
  members: string[] // Member IDs
}

// Task Data
export interface TaskData {
  boardId: string // Board ID
  laneId: string // Lane ID
  name: string
  description: string
  status: 'In progress' | 'Open' | 'Closed'
  assignees: string[] // Assignee IDs
  deadline: Date
  priority: 'Low' | 'Medium' | 'High'
}
