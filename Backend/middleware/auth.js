function auth(req, res, next) {
    if (req.user?.id) return next();
    return res.sendStatus(401);
}

async function verifyOwner(req, res, next) {
    const { projectId } = req.params;
    const project = await Project.findById(projectId).exec();

    if (!project) {
        return res.status(404).json({ error: "Project not found." });
    }

    if (req.user._id.toString() !== project.ownerId.toString()) {
        return res.status(403).json({ error: "You are not the owner of this project." });
    }

    req.project = project; // Pass the project to the next middleware
    next();
}

module.exports = auth;
module.exports.verifyOwner = verifyOwner;