"use strict";

module.exports = function (app) {
  const controller = require("../controllers/subscribers");

  app.route("/subscribes").post(controller.createSubscribes);
};
