const { sequelize, Transactions } = require("../models");
import { Op } from "sequelize";

export async function getTransactions(req, res, next) {
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
        { transactionID: { [Op.like]: "%" + req.query?.search + "%" } },
      ];
    }

    // If some query filter
    if (req.query?.where) {
      query["where"] = { ...query["where"], ...req.query.where };
    }

    //// Select attributes
    query["attributes"] = [
      "id",
      "transactionId",
      "packageId",
      "subscriptionId",
      "userId",
      "tax",
      "totalAmount",
      "paidAmount",
      "offerId",
      "billingAddress",
      "createdAt",
      "status",
    ];
    let data = await Transactions.findAndCountAll(query);

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

export async function getTransactionById(req, res, next) {
  let query = {};

  try {
    query["where"] = { id: req.params.userId, status: "Active" };
    query["attributes"] = [
      "id",
      "transactionId",
      "TransactionId",
      "packageId",
      "subscriptionId",
      "userId",
      "tax",
      "totalAmount",
      "paidAmount",
      "offerId",
      "billingAddress",
      "createdAt",
      "status",
    ];
    let data = await Transactions.findOne(query);

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
