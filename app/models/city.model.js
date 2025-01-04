import mongoose from "mongoose";

const citySchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    state_name: {
      type: String,
    },

    code: {
      type: String,
    },
    towns: {
      type: Array,
      default: [],
    },

    is_deleted: {
      type: Boolean,
      default: false,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const cityModel = mongoose.model("cities", citySchema);
cityModel.createIndexes();

export default cityModel;
