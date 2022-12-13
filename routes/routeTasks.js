const express = require("express");
const Router = express.Router();
const { homePage, getUser } = require("../controllers/logic");

Router.get("/", homePage);
Router.get("/username", getUser);

module.exports = Router;
