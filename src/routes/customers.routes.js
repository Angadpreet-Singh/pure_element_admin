const express = require("express");
const CustomerController = require("../controller/customers.controller");
const auth = require("../middleware/auth");
const { checkSchema } = require("express-validator");
import validate from "../middleware/validation";
const multer = require("multer");
const api = express.Router();
import fs from 'fs'
import {
  userValidation,
  userLoginValidation,
  changeStatusValidation,
  otpValidation,
  verifyOtpValidation,
  changePassword,
  forgetPassword,
} from "../validation/users";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdirSync(global.config.userAvatarUploadPath, { recursive: true });
    return cb(null, global.config.userAvatarUploadPath)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
    cb(null, uniqueSuffix + ext)
  }
})

const upload = multer({ storage: storage });

api.get("/me", auth.ensureAuth("Customer"), CustomerController.checkUserStatus);

api.post(
  "/signUp",
  [checkSchema(userValidation), validate],
  CustomerController.signUpCustomer
);

api.post(
  "/login",
  [checkSchema(userLoginValidation), validate],
  CustomerController.logIn
);

api.post(
  "/",
  auth.ensureAuth("Admin", "User"),
  [checkSchema(userValidation), validate],
  CustomerController.createCustomer
);
api.delete(
  "/:id",
  auth.ensureAuth("Admin", "User"),
  CustomerController.deleteUser
);
api.get("/", auth.ensureAuth("Admin", "User"), CustomerController.getCustomers);
api.get(
  "/:id",
  auth.ensureAuth("Admin", "User"),
  CustomerController.getCustomerById
);
api.patch(
  "/:id",
  auth.ensureAuth("Admin", "User"),
  [checkSchema(changeStatusValidation), validate],
  CustomerController.updateCustomerStatus
);
api.put(
  "/:id",
  auth.ensureAuth("Admin", "User"),
  // [checkSchema(userValidation), validate],
  upload.single("user_avatar"),
  CustomerController.updateCustomer
);

api.post(
  "/send-otp",
  [checkSchema(otpValidation), validate],
  CustomerController.sendOTPFn
);

api.post(
  "/verify-otp",
  [checkSchema(verifyOtpValidation), validate],
  CustomerController.verifyOtp
);

api.post(
  "/change-password",
  auth.ensureAuth("Customer"),
  [checkSchema(changePassword), validate],
  CustomerController.changePassword
);
api.post(
  "/forget-password",
  // auth.ensureAuth("Customer"),
  [checkSchema(forgetPassword), validate],
  CustomerController.forgetPassword
);

module.exports = api;
