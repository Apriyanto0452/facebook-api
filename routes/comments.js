"use strict";

module.exports = function (app) {
  const controller = require("../controllers/comments");

  app.route("/comments").post(controller.createComments);

  app.route("/comments").get(controller.comments);

  app.route("/comments/:comment_id").get(controller.findComments);

  app.route("/comments/:comment_id").put(controller.updateComments);

  app.route("/comments/:comment_id").delete(controller.deleteComments);
};
