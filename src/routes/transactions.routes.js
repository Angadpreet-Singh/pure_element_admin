const express = require("express");
const transactionsController = require("../controller/transactions.controller");
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

api.get("/", auth.ensureAuth("Admin", "User", "Guest"), transactionsController.getTransactions);
api.get("/:id", auth.ensureAuth("Admin", "User"), transactionsController.getTransactionById);


module.exports = api;