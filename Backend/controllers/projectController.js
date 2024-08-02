const Project = require("../models/Project");
const Board = require("../models/Board");
const Task = require("../models/Task");
const mongoose = require("mongoose");

async function createProject(req, res) {
  const { name, description, status, members, priority, deadline } = req.body;
  const createdBy = req.user._id; // Assuming the user object is attached to the request

  try {
    const project = await Project.create({
      name,
      description,
      status: status || "new",
      members,
      priority,
      deadline,
      createdBy,
    });

    const board = await Board.create({
      name: "Kanban Board",
      project: project._id,
    });

    project.boards.push(board._id);
    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate({
        path: "boards",
        populate: { path: "tasks" },
      })
      .exec();

    return res.json(populatedProject);
  } catch (error) {
    console.error("Error creating project: ", error);
    return res.status(500).json({ error: "Failed to create project." });
  }
}

async function getAllProjects(req, res) {
  try {
    const projects = await Project.find().exec();
    return res.json(projects);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch projects." });
  }
}

async function getMemberProjects(req, res) {
  const { userId } = req.params;
  const { projectId } = req.query;

  try {
    const projects = await Project.find({
      members: userId,
      _id: { $ne: projectId },
    }).exec();
    return res.json(projects);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch user's projects." });
  }
}

async function getProject(req, res) {
  try {
    const projectId = req.params.id;

    if (!mongoose.isValidObjectId(projectId)) {
      return res.status(400).json({ error: "Invalid project ID." });
    }

    const project = await Project.findById(projectId)
      .populate({
        path: "boards",
        populate: {
          path: "tasks",
        },
      })
      .exec();

    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    return res.json(project);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch project." });
  }
}

async function getUserProjects(req, res) {
  const { userId } = req.params;

  try {
    const projects = await Project.find({ members: userId })
      .populate({
        path: "boards",
        populate: { path: "tasks" },
      })
      .exec();

    return res.json(projects);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch user's projects." });
  }
}

async function updateProject(req, res) {
  try {
    const { name, description, status, members, priority, deadline } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        status: status || "new",
        members,
        priority,
        deadline,
      },
      { new: true }
    ).exec();

    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    return res.json(project);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update project." });
  }
}

async function getProjectsCloseDueDates(req, res) {
  try {
    const projects = await Project.find({
      deadline: { $lte: new Date() }, // Fetch projects with a deadline less than or equal to the current date
    }).exec();

    return res.json(projects);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Failed to fetch projects close to due dates." });
  }
}

async function deleteProject(req, res) {
  try {
    const project = await Project.findByIdAndDelete(req.params.id).exec();

    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    await Board.deleteMany({ _id: { $in: project.boards } }).exec();
    await Task.deleteMany({ project: project._id }).exec();

    return res.sendStatus(204);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete project." });
  }
}

async function addBoard(req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    const board = await Board.create({ name, project: project._id });

    project.boards.push(board._id);
    await project.save();

    return res.status(201).json(board);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to add board to project." });
  }
}

async function removeBoard(req, res) {
  try {
    const { id, boardId } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    const boardIndex = project.boards.indexOf(boardId);

    if (boardIndex === -1) {
      return res.status(404).json({ error: "Board not found in project." });
    }

    project.boards.splice(boardIndex, 1);
    await project.save();

    await Board.findByIdAndDelete(boardId).exec();
    await Task.deleteMany({ board: boardId }).exec();

    return res.sendStatus(204);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Failed to remove board from project." });
  }
}

async function addMember(req, res) {
  try {
    const { id } = req.params;
    const { memberId } = req.body;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    const memberIndex = project.members.indexOf(memberId);

    if (memberIndex !== -1) {
      return res
        .status(400)
        .json({ error: "Member already exists in project." });
    }

    project.members.push(memberId);
    await project.save();

    return res.sendStatus(204);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to add member to project." });
  }
}

async function removeMember(req, res) {
  try {
    const { id, memberId } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    const memberIndex = project.members.indexOf(memberId);

    if (memberIndex === -1) {
      return res.status(404).json({ error: "Member not found in project." });
    }

    project.members.splice(memberIndex, 1);
    await project.save();

    return res.sendStatus(204);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Failed to remove member from project." });
  }
}

async function deleteAllProjects(req, res) {
  try {
    await Project.deleteMany({}).exec();
    await Board.deleteMany({}).exec();
    await Task.deleteMany({}).exec();

    return res.sendStatus(204);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete all projects." });
  }
}

module.exports = {
  createProject,
  getAllProjects,
  getUserProjects,
  getMemberProjects,
  getProject,
  updateProject,
  getProjectsCloseDueDates,
  deleteProject,
  addBoard,
  removeBoard,
  addMember,
  removeMember,
  deleteAllProjects,
};
