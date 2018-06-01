const mongoose = require('mongoose');

const { Schema } = mongoose;

const SnapshotRequestSchema = new Schema({
  name: { type: String, required: true },
});

const ClientSchema = new Schema({
  name: { type: String, required: true },
  projects: [
    {
      name: { type: String, required: true },
      snapshotRequests: [SnapshotRequestSchema],
    },
  ],
});

const Client = mongoose.model('client', ClientSchema);

module.exports = Client;
