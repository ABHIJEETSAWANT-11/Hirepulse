import jwt from "jsonwebtoken"
import asyncHandler from "express-async-handler"
import User from "../models/userModel.js"
import { DEMO_ACCOUNTS } from "../config/demoUser.js"

const protect = asyncHandler(async (req, res, next) => {
  let token

  token = req.cookies.jwt

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Demo accounts are code-only (no DB documents exist for them).
      const demoAccount = DEMO_ACCOUNTS.find((acc) => acc.id === decoded.userId)
      if (demoAccount) {
        req.user = {
          _id: demoAccount.id,
          id: demoAccount.id,
          name: demoAccount.name,
          email: demoAccount.email,
          userType: demoAccount.userType,
          accountType: "demo",
          profileData: demoAccount.profileData,
        }
        return next()
      }

      req.user = await User.findById(decoded.userId).select("-password")

      next()
    } catch (error) {
      res.status(401)
      throw new Error("Invalid token")
    }
  } else {
    res.status(401)
    throw new Error("Not authorized")
  }
})

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.userType)) {
      res.status(403)
      throw new Error("Not authorized for this action")
    }
    next()
  }
}

export { protect, restrictTo }
