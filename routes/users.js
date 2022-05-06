"use strict";

module.exports = function (app) {
  const controller = require("../controllers/users");

  app.route("/users").get(controller.users);

  app.route("/users/:user_id").get(controller.findUsers);

  app.route("/users").post(controller.createUsers);

  app.route("/users/:user_id").put(controller.updateUsers);

  app.route("/users/:user_id").delete(controller.deleteUsers);

  app.route("/login").get(controller.login);
};
