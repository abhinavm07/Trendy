const model = require("../model/trendySchema");
const CustomAPIError = require("../error/custom-error");

const jwt = require("jsonwebtoken");
// const { models } = require("mongoose");

const bcrypt = require("bcrypt");

const homePage = (req, res) => {
  // throw new Error("Testing Express async error package");

  res.send("Welcome to the Home Page");

  console.log("Home-Page");
};

const signup = async (req, res) => {
  console.log("Welcome to signup");
  const { name, username, email, password } = req.body;

  const existingUser = await model.findOne({ email: email });
  if (existingUser) {
    res
      .status(400)
      .json({ msg: "Sorry ! A user with this email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await model.create({
    name: name,
    username: username,
    email: email,
    password: hashedPassword,
  });

  const userToken = jwt.sign(
    { email: newUser.email, id: newUser._id },
    process.env.JWT_Secret,
    {
      expiresIn: "30d",
    }
  );
  res.status(201).json({ user: newUser, token: userToken });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomAPIError("Please provide email and password !", 400);
  }

  const existingUser = await model.findOne({ email: email });
  if (!existingUser) {
    res.status(400).json({
      msg: "Sorry ! No user with such credentials found. Try Signing Up :)",
    });
  }

  console.log(existingUser.password, password);

  const matchUser = await bcrypt.compare(password, existingUser.password);

  if (!matchUser) {
    return res.status(400).json({ msg: "Sorry Invalid Credentials" });
  }

  const userToken = jwt.sign(
    { email: existingUser.email, id: existingUser._id },
    process.env.JWT_Secret,
    {
      expiresIn: "30d",
    }
  );
  res.status(201).json({ user: existingUser, token: userToken });

  // //creates a new date
  // const id = new Date().getDate();

  // //the values passed as obj are the ones that are present in the jwt token for identification or modification
  // const userToken = jwt.sign({ id, username }, process.env.JWT_Secret, {
  //   expiresIn: "30d",
  // });
  // console.log({ username: username, password: password });

  // //you can debug the token at jwt.io
  // res.status(200).json({ msg: `User Created  with token number ${userToken}` });
};

const dashboard = (req, res) => {
  // if (!authHeader || !authHeader.startWith("Bearer ")) {
  //   console.log("Here");
  //   throw new CustomAPIError("No token available!", 401);
  // }
  const jwtToken = Math.floor(Math.random() * 100);
  res.status(200).json({
    msg: `Hello There ${req.user.username}`,
    tokenNum: `Your Token Number is ${jwtToken}`,
  });
  2;
};

const getUser = async (req, res) => {
  const { name, username, sort, fields } = req.query;
  const queryObj = {};

  if (name) {
    //regex le chai name same to same nabhayeni edi model ma search gareko element xa bhanye dekhauxa Example: req.query ma "Abhi" aayo bhanye resunts ma Abhinab, abhii, abhinavv testo aauxa (just "abhi include bha hunu paryo"), option i ko mathlabh case insensative ho
    //mongoose docs herney confuse bhayema
    queryObj.name = { $regex: name, $options: "i" };
  }

  if (username) {
    queryObj.username = username;
  }

  let results = model.find(queryObj);
  if (sort) {
    const sortLst = sort.split(",").join(" ");
    results = results.sort(sortLst);
  } else {
    results = results.sort("name");
    console.log("From Else");
  }
  if (fields) {
    const fieldsLst = fields.split(",").join(" ");
    //.select lets us select the needed model from the model base
    results = results.select(fieldsLst);
  }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 2;
  const skip = (page - 1) * limit;
  //.skip skips the number of items from the database while limit limits the amount of model supplied to the frontend at a given time.  (read Mongoose docx if confused)
  results = results.skip(skip).limit(limit);
  const dataOut = await results;
  res.status(200).json({ msg: dataOut, hits: dataOut.length });
};

const getStatic = async (req, res) => {
  const dataOut = await model.find({});
  res.status(200).json({ msg: dataOut });
};

const addData = async (req, res) => {
  const dataOut = await model.create(req.query);
  res.status(200).json({ msg: "Successful !" });
};

const deleteData = async (req, res) => {
  const { id: dataID } = req.params;
  const dataOut = await model.findByIdAndDelete({ _id: dataID });
  console.log(dataOut);
  res.status(200).json({ msg: `model with the ID of : ${dataID} deleted !` });
};

module.exports = {
  homePage,
  signup,
  getStatic,
  getUser,
  addData,
  deleteData,
  login,
  dashboard,
};
