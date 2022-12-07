const express = require("express");
const Router = express.Router();
const { homePage } = require("../controllers/logic");

Router.get("/", homePage);

module.exports = Router;
