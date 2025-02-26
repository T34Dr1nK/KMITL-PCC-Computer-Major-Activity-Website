require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const connection = require("./services/dbconn.js");
connection.connect(function (err) {
  if (err) throw err;
  console.log(`Connected as ID ${connection.threadId}`);
});

const testroutes = require("./router/test.route.js");
const activitiesroutes = require("./router/activities.route.js");

app.use("/", testroutes);
app.use("/activities", activitiesroutes);

app.use(function (req, res) {
  res.status(404).json({ message: "No such route exists" });
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({ message: "Error Message" });
});

module.exports = app;
