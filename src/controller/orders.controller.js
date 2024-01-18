const { sequelize, Users, Orders, Packages } = require("../models");
import { Op } from "sequelize";
import { generateOrderID } from "../utlis/generate-id";


// =======================>Create Order<========================== 
export async function createOrder(req, res, next) {
    try {
        req.body.createdBy = req.user.id;
        req.body.orderId = generateOrderID("PUREE");
        let data = await Orders.create(req.body);

        res.status(200).send({
            status: "success",
            message: "Order Created successfully",
            data: data,
        });
    } catch (error) {
        next(error);
    }
}

// =======================>Update Order<========================== 
export async function updateOrder(req, res, next) {
    try {

        req.body.updatedBy = req.user.id;
        req.body.updatedAt = new Date();
        if (req.body?.customerId) delete req.body.customerId;
        if (req.body?.orderId) delete req.body.orderId;
        if (req.body?.packegId) delete req.body.packegId;
        if (req.body?.transactionId) delete req.body.transactionId;

        let data = await Orders.update(req.body, {
            where: { id: req.params.id },
        });
        return res.status(200).send({
            status: "success",
            message: "Order update successfully",
            data: data,
        });

    } catch (error) {
        next(error);
    }
}

// =======================>Get listing Order<========================== 
export async function getOrder(req, res, next) {
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
                { packegId: { [Op.like]: "%" + req.query?.search + "%" } },
                { paymentStatus: { [Op.like]: "%" + req.query?.search + "%" } },
                { customerId: { [Op.like]: "%" + req.query?.search + "%" } },
                { couponId: { [Op.like]: "%" + req.query?.search + "%" } },
                { amount: { [Op.like]: "%" + req.query?.search + "%" } },
                { transactionId: { [Op.like]: "%" + req.query?.search + "%" } },
                { orderId: { [Op.like]: "%" + req.query?.search + "%" } },
            ];
        }

        // If some query filter
        if (req.query?.where) {
            query["where"] = { ...query["where"], ...req.query.where };
        }
        query["include"] = [
            {
                model: Packages,
                attributes: [
                    "id",
                    "packageId",
                    "perMonthPrice",
                    "title",
                    "icon",
                    "perMonthPrice",
                    "userLimit",
                    "resourceLimit",
                    "customerLimit",
                    "installationLimit",
                    "rentalLimit", 
                    "servicesLimit",
                    "projectLimit",
                    "supplierLimit",
                    "support",
                    "discription",
                    "createdBy",
                    "updatedBy",
                    "createdAt",
                    "updatedAt",
                    "status",
                ],
                as: "packageDetail",
            },
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
        query["attributes"] = ["id", "customerId", "orderId", "packageId", "amount", "couponId", "paymentStatus", "transactionId", "description", "createdAt", "status"];
        let data = await Orders.findAndCountAll(query);

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

// =======================>Get Order By Id<========================== 
export async function getOrderById(req, res, next) {
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
        query["attributes"] = ["id", "customerId", "orderId", "packageId", "amount", "couponId", "paymentStatus", "transactionId", "description", "createdAt", "status"];
        let data = await Orders.findOne(query);
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

// =======================>Update Order status By Id<========================== 
export async function updateOrderStatus(req, res, next) {
    try {
        let data = await Orders.update(
            { status: req.body.status },
            { where: { id: req.params.id } }
        );
        res.status(200).send({
            status: "success",
            message: `Order ${req.body.status} successfully`,
            data: data,
        });
    } catch (error) {
        next(error);
    }
}

// =======================>Delete Order By Id<========================== 
export async function deleteOrder(req, res, next) {
    try {
        let data = await Orders.destroy({
            where: {
                id: req.params.id,
            },
        });
        if (data) {
            res.status(200).send({
                status: "success",
                message: "Order deleted successfully",
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
