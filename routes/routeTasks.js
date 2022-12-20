const express = require("express");
const Router = express.Router();
const {
  homePage,
  getStatic,
  getUser,
  addData,
  deleteData,
} = require("../controllers/logic");

Router.get("/", homePage);
Router.get("/allData", getStatic);
Router.get("/add", addData);
Router.get("/username", getUser);
Router.delete("/:id", deleteData);

module.exports = Router;
