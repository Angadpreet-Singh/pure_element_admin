const express = require('express');
const newslettersController = require("../controller/newsletters.controller")
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

api.post("/",auth.ensureAuth("Admin", "User", "Guest"), (newslettersController.createNewsletter));
api.get("/", auth.ensureAuth("Admin","User"), newslettersController.getNewsletters);
api.get(
  "/:id",
  auth.ensureAuth("Admin", "User"),
  newslettersController.getNewsletterById
);
api.patch(
  "/:id",
  auth.ensureAuth("Admin", "User"),
  newslettersController.updateNewsletterStatus
);
api.put(
  "/:id",
  auth.ensureAuth("Admin","User"),
  newslettersController.updateNewsletter
);

api.delete(
  "/:id",
  auth.ensureAuth("Admin","User"),
  newslettersController.deleteNewsletter
);

module.exports = api;