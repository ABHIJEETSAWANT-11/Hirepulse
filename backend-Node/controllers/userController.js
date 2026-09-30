import asyncHandler from "express-async-handler"
import User from "../models/userModel.js"
import generateToken from "../utils/generateToken.js"
import { findDemoAccount, DEMO_ACCOUNTS } from "../config/demoUser.js"
import MetricSnapshot from "../models/metricSnapshotModel.js"

// @desc user token
// route /api/users/auth
// @method post
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Code-only demo accounts — no MongoDB required.
  // Checked before the DB lookup so login works even when the database is
  // unreachable. A real JWT cookie is still issued so protected routes work.
  const demoAccount = findDemoAccount(email, password)
  if (demoAccount) {
    generateToken(res, demoAccount.id)
    return res.status(200).json({
      _id: demoAccount.id,
      name: demoAccount.name,
      email: demoAccount.email,
      userType: demoAccount.userType,
      accountType: "demo",
      profileData: demoAccount.profileData,
    })
  }

  // Demo email with a wrong password: deny immediately without touching the
  // DB (also avoids a confusing 503 when the database happens to be down).
  const normalizedEmail = String(email || "").trim().toLowerCase()
  if (DEMO_ACCOUNTS.some((acc) => acc.email === normalizedEmail)) {
    res.status(401)
    throw new Error("Invalid email or password")
  }

  let user = null
  try {
    user = await User.findOne({ email })
  } catch (err) {
    // MongoDB unreachable — a raw 500 here would confuse users; the demo
    // accounts are the guaranteed-working path when the DB is down.
    res.status(503)
    throw new Error("Database unavailable — use a demo account from the login page")
  }

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id)

    // Stamp lastLogin in profileData — non-fatal if it fails
    if (!user.profileData) user.profileData = {}
    user.profileData.lastLogin = new Date()
    try {
      await user.save()
    } catch {
      // saving lastLogin is best-effort only
    }

    // Fetch recent snapshots to compute deltas on the dashboard
    let pastMetrics = {}
    try {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      
      const snapshots = await MetricSnapshot.find({ 
        userId: String(user._id),
        weekOf: { $gte: oneWeekAgo } 
      }).sort({ weekOf: -1 })
      
      for (const snap of snapshots) {
        if (pastMetrics[snap.metric] === undefined) {
          pastMetrics[snap.metric] = snap.value
        }
      }
    } catch {
      // Best effort
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      userType: user.userType,
      accountType: user.accountType || "real",
      profileData: { ...(user.profileData || {}), pastMetrics },
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

  if (!user.profileData) user.profileData = {}
  user.profileData.lastLogin = new Date()
  try {
    await user.save()
  } catch {
    // best-effort
  }

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    userType: user.userType,
    accountType: user.accountType || "real",
    profileData: user.profileData || null,
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
  // Demo accounts have no DB document — serve the code-only profile
  const demoAccount = DEMO_ACCOUNTS.find((acc) => acc.id === (req.user?.id || req.user?._id))
  if (demoAccount) {
    return res.status(200).json({
      _id: demoAccount.id,
      name: demoAccount.name,
      email: demoAccount.email,
      userType: demoAccount.userType,
      accountType: "demo",
      profileData: demoAccount.profileData,
    })
  }

  const user = await User.findById(req.user._id)
  if (!user) {
    res.status(404)
    throw new Error("User not found")
  }
  // Fetch recent snapshots to compute deltas on the dashboard
  let pastMetrics = {}
  try {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    const snapshots = await MetricSnapshot.find({ 
      userId: String(user._id),
      weekOf: { $gte: oneWeekAgo } 
    }).sort({ weekOf: -1 })
    
    for (const snap of snapshots) {
      if (pastMetrics[snap.metric] === undefined) {
        pastMetrics[snap.metric] = snap.value
      }
    }
  } catch {
    // Best effort
  }

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    userType: user.userType,
    accountType: user.accountType || "real",
    profileData: { ...(user.profileData || {}), pastMetrics },
  })
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
      accountType: updatedUser.accountType || "real",
      profileData: updatedUser.profileData || null,
    })
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

export { authUser, registerUser, logoutUser, getUserProfile, updateUserProfile }
