const express = require('express');
const promoCodeController = require("../controller/promoCodes.controller")
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

api.post("/",auth.ensureAuth("Admin", "User"), (promoCodeController.createPromo));
api.get("/", auth.ensureAuth("Admin","User"), promoCodeController.getPromos);
api.get(
  "/:id",
  auth.ensureAuth("Admin", "User"),
  promoCodeController.getPromoById
);
api.patch(
  "/:id",
  auth.ensureAuth("Admin", "User"),
  promoCodeController.updatePromoStatus
);
api.put(
  "/:id",
  auth.ensureAuth("Admin","User"),
  promoCodeController.updatePromo
);

module.exports = api;