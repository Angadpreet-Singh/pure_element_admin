const { sequelize, TicketLogs, Tickets, Users } = require("../models");
import { Op } from "sequelize";

// >>>>>>>>>>>>>>>>>>>>>>>>>>CRUD OF TICKETLOGS<<<<<<<<<<<<<<<<<<<<<<<<<<<

// ==========================>Create Ticket Logs <===========================
export async function createTicketLog(req, res, next) {
    try {

        req.body.createdAt = new Date();
        req.body.createdBy = req.user.id;
        let data = await TicketLogs.create(req.body);

        res.status(200).send({
            status: "success",
            message: "Ticket Log Created successfully",
            data: data,
        });
    } catch (error) {
        next(error);
    }
}

// ==========================>Get Listing BY TicketId <===========================
export async function getTicketLogByTicketId(req, res, next) {
    let query = {};

    try {
        query["where"] = { ticketId: req.params.ticketId };

        query["include"] = [
            {
                model: Tickets,
                as: "ticketDetail",
                include: [
                    {
                        model: Users,
                        attributes: [
                            "id",
                            "user_id",
                            "first_name",
                            "last_name",
                            "email_address",
                            "phone_number",
                            "user_role",
                            "user_type",
                            "user_avatar",
                            "createdAt"
                        ],
                        as: "userDetail",
                    },

                ],
            },
        ];

        query["attributes"] = ["id", "ticketId", "userId", "message", "createdAt", "status"];
        let data = await TicketLogs.findAndCountAll(query);

        if (!data) {
            return res.status(404).send({
                status: "error",
                message: "No Data Found!",
                data: data,
            });
        }
        res.status(200).send({
            status: "Success",
            message: "",
            total: data.count,
            data: data.rows,
        });
    } catch (error) {
        next(error);
    }
}

