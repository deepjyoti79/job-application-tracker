import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    companyName: { type: String, required: true },
    jobTitle: { type: String, required: true },

    status: {
      type: String,
      enum: ["applied", "online_test", "interview", "offer", "rejected"],
      default: "applied",
    },

    jobType: {
      type: String,
      enum: ["internship", "full-time", "contract", "remote"],
    },

    jobLocation: String,
    jobUrl: String,

    appliedDate: { type: Date, default: Date.now },

    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
    },

    source: String,
    notes: String,

    interviews: [
      {
        round: String,
        date: Date,
        mode: String,
        result: String,
        feedback: String,
      },
    ],

    offer: {
      salary: Number,
      currency: String,
      joiningDate: Date,
      accepted: Boolean,
    },
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;
