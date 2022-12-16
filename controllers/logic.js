const data = require("../model/trendySchema");

const homePage = (req, res) => {
  // throw new Error("Testing Express async error package");

  res.send("Welcome to the Home Page");
  console.log("Hi Man");
};

const getUser = async (req, res) => {
  const dataOut = await data.create({
    name: "Abhinab",
    username: "_abhinavm7",
  });

  res.status(200).json({ msg: dataOut });
};

module.exports = { homePage, getUser };
