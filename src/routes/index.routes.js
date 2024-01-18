const express = require('express');
const api=express.Router();


api.use("/users",require('./users.routes'));
api.use("/customers",require('./customers.routes'));
api.use("/promo",require('./promoCodes.routes'));
api.use("/subscriptions",require('./subscriptions.routes'));
api.use("/packages",require('./packages.routes'));
api.use("/faqs",require('./faqs.routes'));
api.use("/contact-us",require('./contact-us.routes'));
api.use("/newsletters", require("./newsletters.routes"));
// api.post("/generate", require("../controller/app-config.controller").generateSercerConfigFile);
api.get("/checkdomain",require("../controller/app-config.controller").checkSubdomain);
// api.post("/database", require("../controller/app-config.controller").databasecreateion)
api.use("/tenent-config", require("./tenent-config.routes"));
api.use("/tickets", require("./tickets.routes"));
api.use("/ticket-logs", require("./ticketLogs.routes"));
api.use("/transactions", require("./transactions.routes"));
api.use("/orders", require("./orders.routes"));
module.exports=api;