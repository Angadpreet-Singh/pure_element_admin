const { sequelize, Tickets,Users } = require("../models");
import { Op } from "sequelize";

export async function createTicket(req, res, next) {
    try {
        let ticketId;
        const ticketData = await Tickets.findAll({
            limit: 1,
            order: [["createdAt", "DESC"]]
        })
        if (ticketData && ticketData?.length > 0) {
            ticketId =
                ticketData[0].ticketId + 1
        } else {
            ticketId = 1000;
        }
        req.body.ticketId = ticketId
        req.body.createdBy = req.user.id;
        let data = await Tickets.create(req.body);

        res.status(200).send({
            status: "success",
            message: "Ticket Created successfully",
            data: data,
        });
    } catch (error) {
        next(error);
    }
}

export async function updateTicket(req, res, next) {
    try {
        const ticketdata = await Tickets.findOne({
            where: {
                id: req.params.id
            }
        })
        if (ticketdata?.ticketStatus === "open") {
            req?.body?.ticketStatus == req?.body?.ticketStatus
            req.body.updatedBy = req.user.id;
            req.body.updatedAt = new Date();
            let data = await Tickets.update(req.body, {
                where: { id: req.params.id },
                
            });
            return res.status(200).send({
                status: "success",
                message: "Ticket update successfully",
                data: data,
            });
        } else {
            delete req.body.ticketStatus;
            req.body.updatedBy = req.user.id;
            req.body.updatedAt = new Date();
            let data = await Tickets.update(req.body, {
                where: { id: req.params.id },
            });
           return res.status(200).send({
                status: "success",
                message: "Ticket update successfully",
                data: data,
            });
        }

    } catch (error) {
        next(error);
    }
}

export async function getTicket(req, res, next) {
    let query = {};

    try {
        let limit = req?.query?.limit ? Number(req.query.limit) : 10;
        if (req.query?.page) {
            query["limit"] = limit;
            query["offset"] = (Number(req.query.page) - 1) * limit;
        }

        let order = req.query?.order ? req.query?.order : "desc";
        if (req.query?.orderBy) {
            query["order"] = [[req.query?.orderBy, order]];
        } else {
            query["order"] = [["id", order]];
        }

        //// Get only Active and Inactive record
        query["where"] = {
            status: {
                [Op.or]: ["Active", "Inactive"],
            },
        };


        if (req.query?.search) {
            query["where"][Op.or] = [
                { title: { [Op.like]: "%" + req.query?.search + "%" } },
                { ticketId: { [Op.like]: "%" + req.query?.search + "%" } },
                { customerId: { [Op.like]: "%" + req.query?.search + "%" } },
                { ticketStatus: { [Op.like]: "%" + req.query?.search + "%" } },
                { description: { [Op.like]: "%" + req.query?.search + "%" } },
            ];
        }

        // If some query filter
        if (req.query?.where) {
            query["where"] = { ...query["where"], ...req.query.where };
        }
        query["include"] = [
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
        ];

        //// Select attributes
        query["attributes"] = ["id", "ticketId","title", "customerId", "ticketStatus", "description", "createdAt", "status"];
        let data = await Tickets.findAndCountAll(query);

        res.status(200).send({
            status: "Success",
            message: "",
            total: data.count,
            data: data.rows,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export async function updateTicketStatus(req, res, next) {
    try {
        let data = await Tickets.update(
            { status: req.body.status },
            { where: { id: req.params.id } }
        );
        res.status(200).send({
            status: "success",
            message: `Ticket ${req.body.status} successfully`,
            data: data,
        });
    } catch (error) {
        next(error);
    }
}

export async function getTicketById(req, res, next) {
    let query = {};

    try {
        query["where"] = { id: req.params.id };

        query["include"] = [
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
        ];
        query["attributes"] = ["id", "ticketId", "title", "customerId", "ticketStatus", "description", "createdAt", "status"];
        let data = await Tickets.findOne(query);

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
            data,
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteTicket(req, res, next) {
    try {
        let data = await Tickets.destroy({
            where: {
                id: req.params.id,
            },
        });

        if (data) {
            res.status(200).send({
                status: "success",
                message: "Ticket deleted successfully",
                data: data,
            });
        } else {
            res.status(200).send({
                status: "error",
                message: "Somethings wents wrong! Please try again!",
                data: data,
            });
        }
    } catch (error) {
        next(error);
    }
}
