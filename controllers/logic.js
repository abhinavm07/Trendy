const data = require("../model/trendySchema");

const homePage = (req, res) => {
  // throw new Error("Testing Express async error package");

  res.send("Welcome to the Home Page");

  console.log("Hi Man");
};

const getUser = async (req, res) => {
  const { name, username } = req.query;
  const queryObj = {};

  if (name) {
    queryObj.name = name;
  }

  if (username) {
    queryObj.username = username;
  }

  const dataOut = await data.find(queryObj);
  res.status(200).json({ msg: dataOut, hits: dataOut.length });
};

const getStatic = async (req, res) => {
  try {
    const dataOut = await data.find({});
    res.status(200).json({ msg: dataOut });
  } catch (error) {
    console.log(error);
  }
};

const addData = async (req, res) => {
  try {
    const dataOut = await data.create(req.query);
    res.status(200).json({ msg: "Successful !" });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { homePage, getStatic, getUser, addData };
