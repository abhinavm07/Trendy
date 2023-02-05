const express = require("express");
const Router = express.Router();
const {
  homePage,
  signup,
  getStatic,
  getUser,
  addData,
  deleteData,
  login,
  dashboard,
} = require("../controllers/logic");

Router.get("/homepage", homePage);
Router.post("/signup", signup);
Router.get("/allData", getStatic);
Router.get("/add", addData);
Router.get("/username", getUser);
Router.delete("/:id", deleteData);
Router.post("/login", login);
Router.route("/dashboard").get(dashboard);

// Router.use("/signup",express.static("./methods-public"));
module.exports = Router;
