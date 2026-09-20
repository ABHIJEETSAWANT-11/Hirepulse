import asyncHandler from "express-async-handler"
import User from "../models/userModel.js"
import generateToken from "../utils/generateToken.js"
import { isDemoCredentials, DEMO_USER_ID, DEMO_EMAIL, DEMO_PASSWORD, DEMO_USER } from "../config/demoUser.js"

// @desc user token
// route /api/users/auth
// @method post
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Code-only demo account — no MongoDB required. Checked before the DB
  // lookup so login works even when the database is unreachable.
  if (isDemoCredentials(email, password)) {
    generateToken(res, DEMO_USER_ID)
    return res.status(200).json({
      _id: DEMO_USER_ID,
      name: DEMO_USER.name,
      email: DEMO_EMAIL,
      userType: DEMO_USER.userType,
      demo: true,
    })
  }

  // Demo email with a wrong password: deny immediately without touching the
  // DB (also avoids a confusing 503 when the database happens to be down).
  if (String(email || "").trim().toLowerCase() === DEMO_EMAIL && password !== DEMO_PASSWORD) {
    res.status(401)
    throw new Error("Invalid email or password")
  }

  let user = null
  try {
    user = await User.findOne({ email })
  } catch (err) {
    // MongoDB unreachable — a raw 500 here would confuse users; the demo
    // account is the guaranteed-working path when the DB is down.
    res.status(503)
    throw new Error("Database unavailable — use the demo login: abc@gmail.com / ABC123")
  }

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id)

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      userType: user.userType,
    })
  } else {
    res.status(401)
    throw new Error("Invalid email or password")
  }
})

// @desc register user
// route /api/users
// @method post
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, userType } = req.body

  let userExists = null
  try {
    userExists = await User.findOne({ email })
  } catch (err) {
    res.status(503)
    throw new Error("Database unavailable — registration needs a working MongoDB connection")
  }

  if (userExists) {
    res.status(400)
    throw new Error("User already exists")
  }

  const user = await User.create({
    name,
    email,
    password,
    userType: userType || 'student',
  })

  if (!user) {
    res.status(400)
    throw new Error("Invalid data")
  }

  generateToken(res, user._id)

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    userType: user.userType,
  })
})

// @desc logout user
// route /api/users/logout
// @method post
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  })
  res.status(200).json({ message: "User logged out" })
})

// @desc get user profile
// route /api/users/profile
// @method get
const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user.id,
    name: req.user.name,
    email: req.user.email,
  }
  res.status(200).json(user)
})

// @desc update user profile
// route /api/users/profile
// @method put
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email

    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    })
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

export { authUser, registerUser, logoutUser, getUserProfile, updateUserProfile }
