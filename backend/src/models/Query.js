import mongoose from "mongoose";

const QuerySchema = new mongoose.Schema(
  {
    queryText: {
      type: String,
      required: true
    },

    responseText: {
      type: String,
      required: true
    },

    confidenceScore: {
      type: Number,
      min: 0,
      max: 1,
      default: 0
    },

    responseTimeMs: {
      type: Number,
      required: true
    },

    sources: [
      {
        filename: String,
        relevance: Number
      }
    ],

    workflow: {
      type: [String],
      default: []
    },

    metadata: {
      type: Object,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Query", QuerySchema);
