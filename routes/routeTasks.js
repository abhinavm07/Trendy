const express = require("express");
const Router = express.Router();
const {
  homePage,
  getStatic,
  getUser,
  addData,
  deleteData,
  login,
  dashboard,
} = require("../controllers/logic");

Router.get("/", homePage);
Router.get("/allData", getStatic);
Router.get("/add", addData);
Router.get("/username", getUser);
Router.delete("/:id", deleteData);
Router.post("/login", login);
Router.get("/dashboard", dashboard);
module.exports = Router;
