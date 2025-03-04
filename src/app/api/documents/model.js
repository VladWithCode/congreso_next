import { Schema, Types, model, models } from "mongoose"

const VersionSchema = new Schema({
  version: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  author: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  filename: {
    type: String,
    required: true,
    unique: true,
  },
})

const DocumentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    department: {
      type: Types.ObjectId,
      ref: "Department",
      required: true,
    },
    section: {
      type: Types.ObjectId,
      required: true,
    },
    key: {
      type: String,
      required: true,
      unique: true,
    },
    filename: {
      type: String,
      required: true,
    },
    currentVersion: {
      type: VersionSchema,
      required: true,
    },
    versions: {
      type: [VersionSchema],
    },
  },
  {
    timestamps: true,
  }
)

export default models.Doc || model("Doc", DocumentSchema)
