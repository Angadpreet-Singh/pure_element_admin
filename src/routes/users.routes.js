const express = require("express");
const UserController = require("../controller/users.controller");
const auth = require("../middleware/auth");
const api = express.Router();
const { checkSchema } = require("express-validator");
import validate from "../middleware/validation";
const multer = require("multer");
import fs from 'fs';
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

const upload = multer({ storage: storage })

api.post(
  "/login",
  [checkSchema(userLoginValidation), validate],
  UserController.logInAdmin
);

api.post(
  "/",
  auth.ensureAuth("Admin", "User"),
  [checkSchema(userValidation), validate],
  UserController.createUser
);

api.get(
  "/me",
  auth.ensureAuth("Admin", "User"),
  UserController.checkUserStatus
);
api.delete("/:id", auth.ensureAuth("Admin", "User"), UserController.deleteUser);
api.get("/", auth.ensureAuth("Admin", "User"), UserController.getUsers);
api.get(
  "/:userId",
  auth.ensureAuth("Admin", "User"),
  UserController.getUserById
);
api.patch(
  "/:id",
  auth.ensureAuth("Admin", "User"),
  [checkSchema(changeStatusValidation), validate],
  UserController.updateUserStatus
);
api.put(
  "/update-profile",
  upload.single("user_avatar"),
  auth.ensureAuth("Admin", "User"),
  // [checkSchema(userValidation), validate],
  UserController.updateUserProfile
);
api.put(
  "/:id",
  auth.ensureAuth("Admin", "User"),
  // [checkSchema(userValidation), validate],
  upload.single("user_avatar"),
  UserController.updateUser
);

api.post(
  "/send-otp",
  [checkSchema(otpValidation), validate],
  UserController.sendOTPFn
);

api.post(
  "/verify-otp",
  [checkSchema(verifyOtpValidation), validate],
  UserController.verifyOtp
);

api.post(
  "/change-password",
  auth.ensureAuth("Admin", "User"),
  [checkSchema(changePassword), validate],
  UserController.changePassword
);
api.post(
  "/forget-password",
  // auth.ensureAuth("Admin", "User"),
  [checkSchema(forgetPassword), validate],
  UserController.forgetPassword
);

module.exports = api;
