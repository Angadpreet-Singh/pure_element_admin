const express = require('express');
const subscriptionController = require("../controller/subscriptions.controller")
const auth = require('../middleware/auth');
const { checkSchema } = require("express-validator");
import validate from "../middleware/validation";
const api = express.Router();
const multer  = require('multer');
import fs from 'fs';

import {
    userValidation,
    userLoginValidation,
    changeStatusValidation,
    otpValidation,
    verifyOtpValidation
  } from "../validation/users";

  
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdirSync(global.config.subscriptionLogoImageUploadPath, { recursive: true });
    return cb(null, global.config.subscriptionLogoImageUploadPath)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
    cb(null, uniqueSuffix+ext)
  }
})

const upload = multer({ storage: storage });

api.post("/",auth.ensureAuth("Admin", "User"), (subscriptionController.createSubscription));
api.get("/", auth.ensureAuth("Admin","User"), subscriptionController.getSubscriptions);
api.get(
  "/:id",
  auth.ensureAuth("Admin", "User"),
  subscriptionController.getSubscriptionById
);
api.patch(
  "/:id",
  auth.ensureAuth("Admin", "User"),
  subscriptionController.updateSubscriptionStatus
);
api.put(
  "/:id",
  auth.ensureAuth("Admin","User"),
  subscriptionController.updateSubscription
);

api.delete(
  "/:id",
  auth.ensureAuth("Admin","User"),
  subscriptionController.deleteSubscription
);
api.put(
  "/logo/:id",
  auth.ensureAuth("Admin","User"),upload.single('logo'),
  subscriptionController.updateSubscriptionlogo
);

module.exports = api;