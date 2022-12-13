const homePage = (req, res) => {
  res.send("Welcome to the Home Page");
  console.log("Hi Man");
};

const getUser = (req, res) => {
  res.status(200).json({ msg: "Get User From UserName" });
};

module.exports = { homePage, getUser };
