const mongoose = require('mongoose');
const validate = require('mongoose-validator');

const { Schema } = mongoose;

const imageUrlValidator = [
  validate({
    validator: 'isURL',
    message: 'invalid image URL',
  }),
];

const SnapshotSchema = new Schema({
  imageUrl: {
    type: String,
    required: true,
    validate: (imageUrlValidator),
  },
  requestId: {
    type: String,
    required: true,
  },
  comment: { type: String, required: true },
});

const Snapshot = mongoose.model('snapshot', SnapshotSchema);

module.exports = Snapshot;
