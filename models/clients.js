const mongoose = require('mongoose');

const { Schema } = mongoose;

const SnapshotRequestSchema = new Schema({
  name: { type: String, required: true },
});

const ProjectSchema = new Schema({
  name: { type: String, required: true },
  snapshotRequests: [SnapshotRequestSchema],
});

const ClientSchema = new Schema({
  name: { type: String, required: true },
  projects: [ProjectSchema],
});

const Client = mongoose.model('client', ClientSchema);

module.exports = Client;
