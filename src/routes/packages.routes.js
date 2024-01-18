const express = require('express');
const packageController = require("../controller/packages.controller")
const auth = require('../middleware/auth');
const { checkSchema } = require("express-validator");
import validate from "../middleware/validation";
const api = express.Router();

import {
    userValidation,
    userLoginValidation,
    changeStatusValidation,
    otpValidation,
    verifyOtpValidation
  } from "../validation/users";


// Package
api.post("/",auth.ensureAuth("Admin", "User"), (packageController.createPackage));
api.get("/", auth.ensureAuth("Guest","User","Admin"), packageController.getPackages);
api.get(
  "/:id",
  auth.ensureAuth("Guest"),
  packageController.getPackageById
);
api.patch(
  "/:id",
  auth.ensureAuth("Admin", "User"),
  packageController.updatePackageStatus
);
api.put(
  "/:id",
  auth.ensureAuth("Admin","User"),
  packageController.updatePackage
);

api.delete(
  "/:id",
  auth.ensureAuth("Admin","User"),
  packageController.deletePackage
);

// Offer
api.get(
  "/:packageID/prices/:id",
  auth.ensureAuth("Admin", "User"),
  packageController.getOfferById
);

api.put(
  "/:packageID/prices/:id",
  auth.ensureAuth("Admin", "User"),
  packageController.updateOffer
);

api.post(
  "/:packageID/prices",
  auth.ensureAuth("Admin", "User"),
  packageController.createOffer
);

api.delete(
  "/:packageID/prices/:id",
  auth.ensureAuth("Admin", "User"),
  packageController.deleteOffer
);


// Service
api.put(
  "/:packageID/services/:id",
  auth.ensureAuth("Admin", "User"),
  packageController.updateService
);

api.post(
  "/:packageID/services",
  auth.ensureAuth("Admin", "User"),
  packageController.createService
);

api.delete(
  "/:packageID/services/:id",
  auth.ensureAuth("Admin", "User"),
  packageController.deleteService
);


module.exports = api;