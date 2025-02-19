const express = require("express");
const { testSys, testJWT , testgenToken} = require("../controller/test.controller.js");
const route = express.Router();
const authMiddleware = require("../Middleware/authMiddleware.js");

route.get("/test", testSys);
route.get("/testAuth", authMiddleware, testJWT);
route.get('/testgenToken', testgenToken);
module.exports = route;
