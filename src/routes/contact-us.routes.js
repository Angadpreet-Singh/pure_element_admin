const express = require("express");
const contactUsController = require("../controller/contact-us");
const auth = require("../middleware/auth");
const { checkSchema } = require("express-validator");
import validate from "../middleware/validation";
const api = express.Router();

import {
  userValidation,
  userLoginValidation,
  changeStatusValidation,
  otpValidation,
  verifyOtpValidation,
} from "../validation/users";

api.post(
  "/",
  auth.ensureAuth("Admin", "User", "Guest"),
  contactUsController.createContactUs
);
api.get(
  "/",
  auth.ensureAuth("Admin", "User"),
  contactUsController.getContactsUs
);
api.get(
  "/:id",
  auth.ensureAuth("Admin", "User"),
  contactUsController.getContactUsById
);
api.patch(
  "/:id",
  auth.ensureAuth("Admin", "User"),
  contactUsController.updateContactUsStatus
);
api.put(
  "/:id",
  auth.ensureAuth("Admin", "User"),
  contactUsController.updateContactUs
);

api.delete(
  "/:id",
  auth.ensureAuth("Admin", "User"),
  contactUsController.deleteContactUs
);

module.exports = api;
