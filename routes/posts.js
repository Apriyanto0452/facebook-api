"use strict";

module.exports = function (app) {
  const controller = require("../controllers/posts");

  app.route("/posts").post(controller.createPosts);

  app.route("/posts").get(controller.posts);

  app.route("/posts/:user_id").get(controller.findPosts);

  app.route("/posts/:post_id").put(controller.updatePosts);

  app.route("/posts/:user_id").delete(controller.deletePosts);
};
