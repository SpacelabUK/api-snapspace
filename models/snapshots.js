const mongoose = require('mongoose');
const validate = require('mongoose-validator');

const { Schema } = mongoose;

const imageURLValidator = [
  validate({
    validator: 'isURL',
    message: 'invalid image URL',
  }),
];

const SnapshotSchema = new Schema({
  imageURL: {
    type: String,
    required: true,
    validate: (imageURLValidator),
  },
  requestId: {
    type: String,
    required: true,
  },
  comment: { type: String, required: true },
});

const Snapshot = mongoose.model('snapshot', SnapshotSchema);

module.exports = Snapshot;
