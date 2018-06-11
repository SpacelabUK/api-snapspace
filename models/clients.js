const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const SnapshotRequestSchema = new Schema({
  name: { type: String, required: true },
  sequence: { type: Number, required: true },
  status: {
    type: String,
    enum: ['deleted', 'active'],
    required: true,
  },
});

const ProjectSchema = new Schema({
  name: { type: String, required: true },
  snapshotRequests: [SnapshotRequestSchema],
});

const ClientSchema = new Schema({
  name: { type: String, required: true, unique: true },
  projects: [ProjectSchema],
});

ClientSchema.plugin(uniqueValidator);

const Client = mongoose.model('client', ClientSchema);

module.exports = Client;
