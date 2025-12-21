const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true
    },

    originalName: {
      type: String,
      required: true
    },

    fileType: {
      type: String,
      enum: [".pdf", ".doc", ".docx", ".txt"],
      required: true
    },

    filePath: {
      type: String,
      required: true
    },

    size: {
      type: Number, // bytes
      required: true
    },

    chunkCount: {
      type: Number,
      default: 0
    },

    characterCount: {
      type: Number,
      default: 0
    },

    metadata: {
      type: Object,
      default: {}
    },

    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Document", DocumentSchema);
