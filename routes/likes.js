"use strict";

module.exports = function (app) {
  const controller = require("../controllers/likes");

  app.route("/likes").post(controller.createLikes);
};
