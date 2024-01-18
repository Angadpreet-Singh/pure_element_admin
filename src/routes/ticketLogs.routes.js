const express = require("express");
const ticketLogController = require("../controller/ticketlogs.controller");
const auth = require("../middleware/auth");
const api = express.Router();



api.post("/", auth.ensureAuth("Admin", "User"), ticketLogController.createTicketLog);
api.get("/:ticketId", auth.ensureAuth("Admin", "User"), ticketLogController.getTicketLogByTicketId);


module.exports = api;
