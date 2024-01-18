const { sequelize, Faqs } = require("../models");
import { Op } from "sequelize";

export async function createFaq(req, res, next) {
  try {
    req.body.createdBy = req.user.id;
    let data = await Faqs.create(req.body);

    res.status(200).send({
      status: "success",
      message: "FAQ Created successfully",
      data: data,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateFaq(req, res, next) {
  try {
    req.body.updatedBy = req.user.id;
    req.body.updatedAt = new Date();
    let data = await Faqs.update(req.body, {
      where: { id: req.params.id },
    });

    res.status(200).send({
      status: "success",
      message: "FAQ update successfully",
      data: data,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateFaqStatus(req, res, next) {
  try {
    let data = await Faqs.update(
      { status: req.body.status },
      { where: { id: req.params.id } }
    );

    res.status(200).send({
      status: "success",
      message: `FAQ ${req.body.status} successfully`,
      data: data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getFaqs(req, res, next) {
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
        { question: { [Op.like]: "%" + req.query?.search + "%" } },
        { answer: { [Op.like]: "%" + req.query?.search + "%" } },
      ];
    }

    // If some query filter
    if (req.query?.where) {
      query["where"] = { ...query["where"], ...req.query.where };
    }

    //// Select attributes
    query["attributes"] = ["id", "question", "answer", "createdAt", "status"];
    let data = await Faqs.findAndCountAll(query);

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

export async function getFaqById(req, res, next) {
  let query = {};

  try {
    query["where"] = { id: req.params.id };
    query["attributes"] = ["id", "question", "answer", "createdAt", "status"];
    let data = await Faqs.findOne(query);

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

export async function deleteFaq(req, res, next) {
  try {
    let data = await Faqs.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (data) {
      res.status(200).send({
        status: "success",
        message: "FAQ deleted successfully",
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
