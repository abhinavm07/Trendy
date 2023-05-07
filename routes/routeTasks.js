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
  getTrendSentiment,
} = require("../controllers/trends");

const { getTwtData, searchTwt } = require("../controllers/userData");
const {
  saveChart,
  deleteChart,
  retrieveChart,
  addDataChart,
  unSaveChart,
} = require("../controllers/chartController");

const {
  saveTweets,
  deleteTweet,
  retrieveTweets,
  addDataTweet,
  savedTweets,
} = require("../controllers/saveController");

const {
  shareContent,
  retrieveSharedCharts,
  retrieveSharedTweets,
  unShareContent,
} = require("../controllers/sharedController");

const {
  retriveTrackedUserData,
  suspendTracking,
  changeTrackStatus,
} = require("../controllers/userTracking");

const { autoTracking } = require("../controllers/autoUserTracker");
// const { trackingStatic } = require("../controllers/autoUserTracker");

const { retriveStatic } = require("../controllers/getAllStatic");

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
// Router.get("/fetchSentiment/:trend", getTrendSentiment);
Router.post("/saveChart", saveChart);
Router.post("/deleteChart", deleteChart);
Router.post("/retriveChart", retrieveChart);
Router.post("/addChartData", addDataChart);
// Router.post("/savedCharts", savedChart);
Router.post("/unsaveCharts", unSaveChart);

Router.post("/saveTweet", saveTweets);
Router.post("/deleteTweet", deleteTweet);
Router.post("/retriveTweets", retrieveTweets);
Router.post("/addTweetData", addDataTweet);
Router.post("/savedTweets", savedTweets);
// Router.post("/unsaveTweets", unsaveTweet);

Router.post("/shareContent", shareContent);
Router.post("/retriveSharedCharts", retrieveSharedCharts);
Router.post("/retrieveSharedTweets", retrieveSharedTweets);
Router.post("/unshareContent", unShareContent);

Router.post("/retriveTrackedUsers", retriveTrackedUserData);
Router.post("/suspendTracking", suspendTracking);

Router.post("/changeTrackStatus", changeTrackStatus);

Router.post("/autoTracking", autoTracking);

Router.get("/retriveStatic", retriveStatic);

// Router.post("/staticTracking", trackingStatic);
// Router.use("/signup",express.static("./methods-public"));
module.exports = Router;
