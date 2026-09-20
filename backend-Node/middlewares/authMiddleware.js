import jwt from "jsonwebtoken"
import asyncHandler from "express-async-handler"
import User from "../models/userModel.js"
import { DEMO_USER_ID, DEMO_EMAIL, DEMO_USER } from "../config/demoUser.js"

const protect = asyncHandler(async (req, res, next) => {
  let token

  token = req.cookies.jwt

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Demo account is code-only (no DB document exists for it).
      if (decoded.userId === DEMO_USER_ID) {
        req.user = {
          _id: DEMO_USER_ID,
          id: DEMO_USER_ID,
          name: DEMO_USER.name,
          email: DEMO_EMAIL,
          userType: DEMO_USER.userType,
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

export { protect }
