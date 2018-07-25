const Client = require('../models/clients.js');

const getSnapshotRequests = async (req, res, next) => {
  try {
    const client = await Client.findOne({
      _id: req.params.clId,
    });

    let activeRequests;

    if (client && client.projects.id(req.params.prId)) {
      const savedRequests = client.projects.id(req.params.prId).snapshotRequests;
      activeRequests = savedRequests.filter(savedRequest => savedRequest.status === 'active');
    }

    if (!activeRequests || !Array.isArray(activeRequests) || !activeRequests.length) {
      const error = new Error('Snapshot requests not found');
      error.status = 404;
      next(error);
    } else {
      res.status(200).json(activeRequests);
    }
  } catch (err) {
    const error = new Error(err.message);
    next(error);
  }
};

//  saves snapshot request to DB and sends success message to user
const saveSnapshotRequests = async (req, res, next) => {
  try {
    let client = await Client.findOne({
      _id: req.params.clId,
    });
    const storedRequests = client.projects.id(req.params.prId).snapshotRequests;

    const updatedRequests = req.body;

    // Save new and updated requests
    for (const updatedRequest of updatedRequests) {
      const currentRequest = storedRequests.id(updatedRequest._id);
      if (currentRequest) {
        currentRequest.name = updatedRequest.name;
        currentRequest.sequence = updatedRequest.sequence;
        currentRequest.status = updatedRequest.status;
      } else {
        storedRequests.push(updatedRequest);
      }
    }

    client = await client.save();

    res.status(200).json(storedRequests);
  } catch (err) {
    const error = new Error(err.message);
    next(error);
  }
};

module.exports = {
  saveSnapshotRequests, getSnapshotRequests,
};
