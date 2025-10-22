const mongoose = require('mongoose');

const fileSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String },
    url: { type: String, required: true },
    size: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model('File', fileSchema);
