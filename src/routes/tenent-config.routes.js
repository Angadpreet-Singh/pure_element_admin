const express = require("express");
const auth = require("../middleware/auth");
const { checkSchema } = require("express-validator");
const api = express.Router();

api.get(
  "/checkdomain",
  auth.ensureAuth("Admin", "User","Customer"),
  require("../controller/app-config.controller").checkSubdomain
);

api.get(
  "/activities",
  auth.ensureAuth("Admin", "User","Customer"),
  require("../controller/app-config.controller").getSubscriptionsActivities
);

api.get(
  "/check-subscription",
  require("../controller/app-config.controller").checkSubscription
);

api.post(
  "/copy-files",
  auth.ensureAuth("Admin", "User", "Customer"),
  require("../controller/app-config.controller").copyFiles
);

api.post(
  "/clone-files",
  auth.ensureAuth("Admin", "User", "Customer"),
  require("../controller/app-config.controller").cloneSourceFiles
);

api.post(
  "/generate-configurations",
  auth.ensureAuth("Admin", "User", "Customer"),
  require("../controller/app-config.controller").generateAllConfigFiles
);

api.post(
  "/install-dependancies",
  auth.ensureAuth("Admin", "User", "Customer"),
  require("../controller/app-config.controller").installDependancies
);

api.post(
  "/generate-build",
  auth.ensureAuth("Admin", "User", "Customer"),
  require("../controller/app-config.controller").generateBuild
);

api.post(
  "/start-server",
  auth.ensureAuth("Admin", "User", "Customer"),
  require("../controller/app-config.controller").startServer
);

api.post(
  "/setup-user",
  auth.ensureAuth("Admin", "User", "Customer"),
  require("../controller/app-config.controller").setupUser
);

api.post(
  "/finishing",
  auth.ensureAuth("Admin", "User", "Customer"),
  require("../controller/app-config.controller").finishing
);

api.post(
  "/testing",
  auth.ensureAuth("Admin", "User", "Customer"),
  require("../controller/app-config.controller").testCommandApi
);

module.exports = api;
