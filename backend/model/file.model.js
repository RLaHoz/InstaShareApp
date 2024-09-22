const mongoose = require('mongoose');

const FILE_STATUSES = {
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  originalName: { type: String, required: true },
  compressedName: {
    type: String
  },
  size: { type: Number, required: true },
  status: { type: String, enum: Object.values(FILE_STATUSES), default: FILE_STATUSES.PROCESSING },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
  filePath: { type: String, required: true }
});

const File = mongoose.model('File', fileSchema);
module.exports = {
  File,
  FILE_STATUSES
};
