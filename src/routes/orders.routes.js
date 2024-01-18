const express = require("express");
const orderController = require("../controller/orders.controller");
const auth = require("../middleware/auth");
const api = express.Router();



api.post("/", auth.ensureAuth("Admin", "User"), orderController.createOrder);
api.get("/", auth.ensureAuth("Admin", "User", "Guest"), orderController.getOrder);
api.get("/:id", auth.ensureAuth("Admin", "User"), orderController.getOrderById);
api.patch(
    "/:id",
    auth.ensureAuth("Admin", "User"),
    orderController.updateOrderStatus
);
api.put("/:id", auth.ensureAuth("Admin", "User"), orderController.updateOrder);

api.delete("/:id", auth.ensureAuth("Admin", "User"), orderController.deleteOrder);

module.exports = api;

