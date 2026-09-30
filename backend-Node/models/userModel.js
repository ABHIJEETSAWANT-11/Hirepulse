import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ['student'],
      default: 'student',
    },
    // Extended profile schema
    accountType: {
      type: String,
      enum: ['demo', 'real'],
      default: 'real',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    profileData: {
      resumeScore: { type: Number, default: 0 },
      mockCount: { type: Number, default: 0 },
      skillBreakdown: mongoose.Schema.Types.Mixed,
      jobMatches: { type: Array, default: [] },
      lastLogin: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  }
)

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model("User", userSchema)

export default User
