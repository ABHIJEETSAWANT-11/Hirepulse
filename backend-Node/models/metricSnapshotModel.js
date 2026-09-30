import mongoose from "mongoose"

const metricSnapshotSchema = mongoose.Schema(
  {
    userId: {
      type: String, // String to handle both MongoDB ObjectIds and demo IDs
      required: true,
      index: true,
    },
    metric: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    weekOf: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

metricSnapshotSchema.index({ userId: 1, metric: 1, weekOf: 1 }, { unique: true })

const MetricSnapshot = mongoose.model("MetricSnapshot", metricSnapshotSchema)
export default MetricSnapshot
