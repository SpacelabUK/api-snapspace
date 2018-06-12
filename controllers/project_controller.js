
const Client = require('../models/clients.js');

const createProject = async (req, res, next) => {
  try {
    const client = await Client.findOne({
      _id: req.params.clId,
    });

    const projectArrayLength = client.projects.length;
    client.projects.push(req.body);
    const savedClient = await client.save();

    res.status(201).json(savedClient.projects[projectArrayLength]);
  } catch (err) {
    const error = new Error(err.message);
    next(error);
  }
};

module.exports = {
  createProject,
};

