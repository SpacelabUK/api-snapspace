const Client = require('../models/clients.js');

//  saves snapshot request to DB and sends success message to user
const saveSnapshotRequests = async (req, res, next) => {
  try {
    let client = await Client.findOne({
      _id: req.params.clId,
    });

    const currentRequests = client.projects.id(req.params.prId).snapshotRequests;

    const updatedRequests = req.body.snapshotRequests;

    // Save new and updated requests
    for (const updatedRequest of updatedRequests) {
      const currentRequest = currentRequests.id(updatedRequest._id);
      if (currentRequest) {
        currentRequest.name = updatedRequest.name;
        currentRequest.sequence = updatedRequest.sequence;
        currentRequest.status = 'active';
      } else {
        currentRequests.push(updatedRequest);
      }
    }

    // Set any existing requests in DB that are
    // not in the new and updated requests to 'Deleted'
    for (const currentRequest of currentRequests) {
      const currentRequestId = currentRequest._id.toString();
      const matchedRequest =
        updatedRequests.find(updatedRequest => updatedRequest._id === currentRequestId);
      if (!matchedRequest) {
        currentRequest.status = 'deleted';
      }
    }

    client = await client.save();
    res.status(200).json(currentRequests);
  } catch (err) {
    const error = new Error(err.message);
    next(error);
  }
};

module.exports = {
  saveSnapshotRequests,
};
