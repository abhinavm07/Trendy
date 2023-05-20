const express = require("express");
const Router = express.Router();
const { protect } = require("../middleware/authMiddleware");
Router.use(protect);

const {
  trendsV1,
  nearMeT,
  trendTweets,
  trendsAvailable,
  // getTrendSentiment,
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
  deleteTweets,
  retriveTweets,
  addData,
} = require("../controllers/tweetController");

const {
  shareContent,
  retrieveSharedCharts,
  retrieveSharedTweets,
  unShareContent,
  retrieveSharedTweetsBy,
  retrieveSharedChartsBy,
  retrieveAllSharedContent,
} = require("../controllers/sharedController");

const {
  retriveTrackedUserData,
  suspendTracking,
  changeTrackStatus,
  userTracking,
} = require("../controllers/userTracking");

const { emotion } = require("../controllers/logic");

const { autoTracking } = require("../controllers/autoUserTracker");
// const { trackingStatic } = require("../controllers/autoUserTracker");

const { retriveStatic } = require("../controllers/getAllStatic");
const { getCompareData } = require("../controllers/comparision");
const { changePassword, getAllUsers, toggleAdminPermission, toggleAccountStatus} = require("../controllers/admin");

Router.post("/sentiment", emotion);

Router.post("/trend", trendsV1);
Router.post("/nearMe", nearMeT);
Router.post("/trendTweets", trendTweets);
Router.post("/twtUser", getTwtData);
Router.post("/search", searchTwt);
Router.get("/availableCountry", trendsAvailable);
// Router.get("/fetchSentiment/:trend", getTrendSentiment);
Router.post("/saveChart", saveChart);
Router.post("/deleteChart", deleteChart);
Router.post("/retrieveChart", retrieveChart);
Router.post("/addChartData", addDataChart);
// Router.post("/savedCharts", savedChart);
Router.post("/unsaveCharts", unSaveChart);

Router.post("/saveTweet", saveTweets);
Router.post("/deleteTweets", deleteTweets);
Router.post("/retrieveTweets", retriveTweets);
Router.post("/addTweetData", addData);
// Router.post("/savedTweets", savedTweets);
// Router.post("/unsaveTweets", unsaveTweet);

Router.post("/shareContent", shareContent);
Router.post("/retriveSharedCharts", retrieveSharedCharts);
Router.post("/retrieveSharedTweets", retrieveSharedTweets);
Router.post("/retrieveAllShared", retrieveAllSharedContent);
Router.post("/unshareContent", unShareContent);
Router.post("/retriveSharedChartsByUser", retrieveSharedTweetsBy);
Router.post("/retrieveSharedTweetsByUser", retrieveSharedChartsBy);

Router.get("/retrieveTracking", retriveTrackedUserData);
Router.post("/suspendTracking", suspendTracking);

Router.post("/changeTrackStatus", changeTrackStatus);

Router.post("/autoTracking", autoTracking);
Router.post("/track", userTracking);
Router.post("/retriveStatic", retriveStatic);

Router.post("/compareUsers", getCompareData);
Router.get("/listUsers", getAllUsers);

Router.post("/toggleAdminPermission", toggleAdminPermission);
Router.post("/toggleAccountStatus", toggleAccountStatus);

// Router.post("/changePassword", changePassword);

// Router.post("/staticTracking", trackingStatic);
// Router.use("/signup",express.static("./methods-public"));
module.exports = Router;
