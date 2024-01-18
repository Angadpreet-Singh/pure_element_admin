const { sequelize, Subscriptions } = require("../models");
import { Op } from "sequelize";
import { generateID } from "../utlis/generate-id";

export async function createSubscription(req, res, next) {
  try {
    // Generate User ID
    req.body.subscriptionId = generateID("PES");
    let data = await Subscriptions.create(req.body);

    res.status(200).send({
      status: "success",
      message: "Subscription Created successfully",
      data: data,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateSubscription(req, res, next) {
  try {
    let data = await Subscriptions.update(req.body, {
      where: { id: req.params.id },
    });

    res.status(200).send({
      status: "success",
      message: "Subscription update successfully",
      data: data,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateSubscriptionStatus(req, res, next) {
  try {
    let data = await Subscriptions.update(
      { status: req.body.status },
      { where: { id: req.params.id } }
    );

    res.status(200).send({
      status: "success",
      message: `Subscription ${req.body.status} successfully`,
      data: data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getSubscriptions(req, res, next) {
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
        { subscriptionID: { [Op.like]: "%" + req.query?.search + "%" } },
        { subDomain: { [Op.like]: "%" + req.query?.search + "%" } },
      ];
    }

    // If some query filter
    if (req.query?.where) {
      query["where"] = { ...query["where"], ...req.query.where };
    }

    //// Select attributes
    query["attributes"] = [
      "id",
      "userId",
      "packageId",
      "priceId",
      "userLimit",
      "projectLimit",
      "supplierLimit",
      "support",
      "purchaseDate",
      "expireDate",
      "orderStatus",
      "subDomain",
      "databaseName",
      "companayName",
      "logo",
      "createdAt",
      "status",
    ];
    let data = await Subscriptions.findAndCountAll(query);

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

export async function getSubscriptionById(req, res, next) {
  let query = {};

  try {
    query["where"] = { id: req.params.id, status: "Active" };
    query["attributes"] = [
      "id",
      "userId",
      "packageId",
      "priceId",
      "userLimit",
      "projectLimit",
      "supplierLimit",
      "support",
      "purchaseDate",
      "expireDate",
      "orderStatus",
      "subDomain",
      "databaseName",
      "companayName",
      "logo",
      "createdAt",
      "status",
    ];
    let data = await Subscriptions.findOne(query);

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

export async function deleteSubscription(req, res, next) {
  try {
    let data = await Subscriptions.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (data) {
      res.status(200).send({
        status: "success",
        message: "Subscription deleted successfully",
        data: data,
      });
    } else {
      res.status(500).send({
        status: "error",
        message: "Somethings wents wrong! Please try again!",
        data: data,
      });
    }
  } catch (error) {
    next(error);
  }
}

// >>>>>>>>>>>>>>>>>Update logo>>>>>>>>>>>>>>>>>>>>>>>>

export async function updateSubscriptionlogo(req, res, next) {
  try {
    if (req.file) {
      req.body.logo =
        global.config.subscriptionLogoImagePath + "/" + req.file.filename;
    }
    let data = await Subscriptions.update(req.body, {
      where: { id: req.params.id },
    });
    console.log(data);

    res.status(200).send({
      status: "success",
      message: "Subscription logo update successfully",
      data: data,
    });
  } catch (error) {
    next(error);
  }
}
