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

const {
  trendsV1,
  nearMeT,
  trendTweets,
  trendsAvailable,
} = require("../controllers/trends");

const { getTwtData, searchTwt } = require("../controllers/userData");

Router.get("/homepage", homePage);

Router.get("/allData", getStatic);
Router.get("/add", addData);
Router.get("/username", getUser);
Router.delete("/:id", deleteData);

Router.post("/sentiment", emotion);
Router.route("/dashboard").get(dashboard);
Router.post("/trend", trendsV1);
Router.post("/nearMe", nearMeT);
Router.post("/trendTweets", trendTweets);
Router.post("/twtUser", getTwtData);
Router.post("/search", searchTwt);
Router.get("/availableCountry", trendsAvailable);

// Router.use("/signup",express.static("./methods-public"));
module.exports = Router;
