import mongoose from "mongoose"

const interviewSchema = mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      index: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    strengths: [
      {
        type: String,
      },
    ],
    improvements: [
      {
        type: String,
      },
    ],
    overall_feedback: {
      type: String,
      default: "",
    },
    rawTranscript: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
)

const Interview = mongoose.model("Interview", interviewSchema)

export default Interview
