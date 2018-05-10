const mongoose = require('mongoose');
const validate = require('mongoose-validator');

const { Schema } = mongoose;

const imageURLValidator = [
  validate({
    validator: 'isURL',
    message: 'Image URL should be a valid URL',
  }),
];

const SnapshotSchema = new Schema({
  imageURL: {
    type: String,
    required: true,
    validate: imageURLValidator,
  },
  comment: { type: String, required: false },
});

const Snapshot = mongoose.model('snapshot', SnapshotSchema);

module.exports = Snapshot;
