const express = require("express");
const ticketController = require("../controller/tickets.controller");
const auth = require("../middleware/auth");
const api = express.Router();



api.post("/", auth.ensureAuth("Admin", "User"), ticketController.createTicket);
api.get("/", auth.ensureAuth("Admin", "User", "Guest"), ticketController.getTicket);
api.get("/:id", auth.ensureAuth("Admin", "User"), ticketController.getTicketById);
api.patch(
    "/:id",
    auth.ensureAuth("Admin", "User"),
    ticketController.updateTicketStatus
);
api.put("/:id", auth.ensureAuth("Admin", "User"), ticketController.updateTicket);

api.delete("/:id", auth.ensureAuth("Admin", "User"), ticketController.deleteTicket);

module.exports = api;
