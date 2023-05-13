const User = require("../model/userModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

const getUser = async(email) => {
  const user = await User.findOne({email: email});
  return user;
}

const deleteUser = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const UserExists = User.findByIdAndDelete({ email: email });

  if (!UserExists) {
    res.status(200).json({ msg: `User account not Found` });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { email, name, password } = req.body;
  if (name === String) {
    const UserExists = User.findByIdAndUpdate({ email: email }, { name: name });
    return res.send("Success");
  }

  if (password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const UserExists = User.findByIdAndUpdate(
      { email: email },
      { password: hashedPassword }
    );
    return res.send("Success");
  } else {
    res.status(200).json({ msg: `User account not Found` });
  }
});

const createAdmin = asyncHandler(async (req, res) => {
  const { email, state } = req.body;
  const UserExists = User.findByIdAndUpdate(
    { email: email },
    { isAdmin: state }
  );
  return res.send("Success");
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  //check user and password match
  if (
    user &&
    (await bcrypt.compare(password, user.password)) &&
    (user.isAdmin = true)
  ) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: genrateToken(user._id),
    });
  } else {
    return res.status(401).send("Invalid Credentials");
  }
});

module.exports = { getAllUsers, updateUser, deleteUser, loginAdmin, getUser };
