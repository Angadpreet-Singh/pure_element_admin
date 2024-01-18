const { sequelize, ContactUs } = require("../models");
import { Op } from "sequelize";

export async function createContactUs(req, res, next) {
  try {
    let data = await ContactUs.create(req.body);

    res.status(200).send({
      status: "success",
      message: "Message sent! We will contact you soon!",
      data: data,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateContactUs(req, res, next) {
  try {
    req.body.updatedBy = req.user.id;
    req.body.updatedAt = new Date();
    let data = await ContactUs.update(req.body, {
      where: { id: req.params.id },
    });

    res.status(200).send({
      status: "success",
      message: "Contact Us update successfully",
      data: data,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateContactUsStatus(req, res, next) {
  try {
    let data = await ContactUs.update(
      { status: req.body.status },
      { where: { id: req.params.id } }
    );

    res.status(200).send({
      status: "success",
      message: `Contact Us ${req.body.status} successfully`,
      data: data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getContactsUs(req, res, next) {
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
        { fullName: { [Op.like]: "%" + req.query?.search + "%" } },
        { phone: { [Op.like]: "%" + req.query?.search + "%" } },
        { message: { [Op.like]: "%" + req.query?.search + "%" } },
        { email: { [Op.like]: "%" + req.query?.search + "%" } },
      ];
    }

    // If some query filter
    if (req.query?.where) {
      query["where"] = { ...query["where"], ...req.query.where };
    }

    //// Select attributes
    query["attributes"] = [
      "id",
      "fullName",
      "email",
      "phone",
      "message",
      "createdAt",
      "status",
    ];
    let data = await ContactUs.findAndCountAll(query);

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

export async function getContactUsById(req, res, next) {
  let query = {};

  try {
    query["where"] = { id: req.params.id };
    query["attributes"] = [
      "id",
      "fullName",
      "email",
      "phone",
      "message",
      "createdAt",
      "status",
    ];
    let data = await ContactUs.findOne(query);

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

export async function deleteContactUs(req, res, next) {
  try {
    let data = await ContactUs.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (data) {
      res.status(200).send({
        status: "success",
        message: "Contact Us deleted successfully",
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
