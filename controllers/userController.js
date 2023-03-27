const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const { sign } = require('jsonwebtoken')
const User = require('../model/userModel')

// Genrate Token

const genrateToken = (id) => {
  return sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

// @desc Register a new user
// @route /api/users
// access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  // validation
  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please Include all fileds')
  }

  // Find if user already Exists

  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400)
    throw new Error('User Already Exists')
  }

  //Hash Password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  //Create User

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: genrateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc Login a user
// @route /api/users/login
// access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  //check user and password match
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: genrateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid Credentials')
  }
})

// @desc Get current user
// @route /api/users/me
// access Private
const getMe = asyncHandler(async (req, res) => {
  const user = { id: req.user._id, email: req.user.email, name: req.user.name }
  res.status(200).json(user)
})

module.exports = {
  registerUser,
  loginUser,
  getMe,
}
