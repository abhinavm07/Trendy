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
  emotion,
} = require("../controllers/logic");

const { trendsV1, nearMeT } = require("../controllers/trends");

Router.get("/homepage", homePage);

Router.get("/allData", getStatic);
Router.get("/add", addData);
Router.get("/username", getUser);
Router.delete("/:id", deleteData);

Router.post("/api/sentiment", emotion);
Router.route("/dashboard").get(dashboard);
Router.post("/trend", trendsV1);
Router.post("/nearme", nearMeT);

// Router.use("/signup",express.static("./methods-public"));
module.exports = Router;
