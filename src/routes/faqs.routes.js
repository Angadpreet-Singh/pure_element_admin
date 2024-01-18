const express = require("express");
const faqController = require("../controller/faqs.controller");
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

api.post("/", auth.ensureAuth("Admin", "User"), faqController.createFaq);
api.get("/", auth.ensureAuth("Admin", "User", "Guest"), faqController.getFaqs);
api.get("/:id", auth.ensureAuth("Admin", "User"), faqController.getFaqById);
api.patch(
  "/:id",
  auth.ensureAuth("Admin", "User"),
  faqController.updateFaqStatus
);
api.put("/:id", auth.ensureAuth("Admin", "User"), faqController.updateFaq);

api.delete("/:id", auth.ensureAuth("Admin", "User"), faqController.deleteFaq);

module.exports = api;
