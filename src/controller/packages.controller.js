const {
  sequelize,
  Packages,
  PackageOffers,
  PackageServices,
} = require("../models");
import { Op } from "sequelize";
import {generateID} from "../utlis/generate-id";
export async function createPackage(req, res, next) {
  try {
    let offers = [];

    if (req.body?.offers) {
      offers = req.body.offers;
      delete req.body.offers;
    }
    req.body.createdBy = req.user.id;
    req.body.packageId = generateID("PEP");

    let data = await Packages.create(req.body, {
      include: [
        { model: PackageOffers, as: "prices" },
        { model: PackageServices, as: "services" },
      ],
    });

    res.status(200).send({
      status: "success",
      message: "Package Created successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function createOffer(req, res, next) {
  try {
    req.body.createdBy = req.user.id;
    req.body.packageId = req.params.packageID;
    let data = await PackageOffers.create(req.body);

    res.status(200).send({
      status: "success",
      message: "Offer added successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function createService(req, res, next) {
  try {
    req.body.createdBy = req.user.id;
    req.body.packageId = req.params.packageID;
    let data = await PackageServices.create(req.body);

    res.status(200).send({
      status: "success",
      message: "Service added successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function updateOffer(req, res, next) {
  try {
    req.body.updatedBy = req.user.id;
    req.body.updatedAt = new Date();
    let data = await PackageOffers.update(req.body, {
      where: { id: req.params.id },
    });

    res.status(200).send({
      status: "success",
      message: "Offer update successfully",
      data: data,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateService(req, res, next) {
  try {
    req.body.updatedBy = req.user.id;
    req.body.updatedAt = new Date();
    let data = await PackageServices.update(req.body, {
      where: { id: req.params.id },
    });

    res.status(200).send({
      status: "success",
      message: "Service update successfully",
      data: data,
    });
  } catch (error) {
    next(error);
  }
}

export async function updatePackage(req, res, next) {
  try {
    req.body.updatedBy = req.user.id;
    req.body.updatedAt = new Date();
    let data = await Packages.update(req.body, {
      where: { id: req.params.id },
    });

    res.status(200).send({
      status: "success",
      message: "Package update successfully",
      data: data,
    });
  } catch (error) {
    next(error);
  }
}

export async function updatePackageStatus(req, res, next) {
  try {
    let data = await Packages.update(
      {
        status: req.body.status,
        updatedBy: req.user.id,
        updatedAt: new Date(),
      },
      { where: { id: req.params.id } }
    );

    res.status(200).send({
      status: "success",
      message: `Package ${req.body.status} successfully`,
      data: data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPackages(req, res, next) {
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

    let status = ["Active"];

    if (req?.user) status.push("Inactive");

    query["where"] = {
      status: {
        [Op.or]: status,
      },
    };

    if (req.query?.search) {
      query["where"][Op.or] = [
        { title: { [Op.like]: "%" + req.query?.search + "%" } },
        { offerID: { [Op.like]: "%" + req.query?.search + "%" } },
        { packageId: { [Op.like]: "%" + req.query?.search + "%" } },
      ];
    }

    // If some query filter
    if (req.query?.where) {
      query["where"] = { ...query["where"], ...req.query.where };
    }

    //// Select attributes
    query["attributes"] = [
      "id",
      "packageId",
      "icon",
      "title",
      "perMonthPrice",
      "discription",
      "support",
      "userLimit",
      "customerLimit",
      "installationLimit",
      "rentalLimit",
      "servicesLimit",
      "projectLimit",
      "supplierLimit",
      "createdAt",
      "status",
    ];

    query["include"] = [
      {
        model: PackageOffers,
        as: "prices",
        attributes: [
          "id",
          "perMonthPrice",
          "discountType",
          "discount",
          "tenure",
        ],
        where: {
          status: "Active",
        },
        order: [["perMonthPrice", "asc"]],
      },
      {
        model: PackageServices,
        as: "services",
        attributes: ["id", "title"],
        where: {
          status: "Active",
        },
      },
    ];
    let data = await Packages.findAndCountAll(query);

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

export async function getPackageById(req, res, next) {
  let query = {};

  try {
    query["where"] = { id: req.params.id };
    if (!req?.user) query["where"]["status"] = "Active";
    query["attributes"] = [
      "id",
      "packageId",
      "icon",
      "title",
      "perMonthPrice",
      "discription",
      "support",
      "userLimit",
      "customerLimit",
      "installationLimit",
      "rentalLimit",
      "servicesLimit",
      "projectLimit",
      "supplierLimit",
      "createdAt",
      "status",
    ];

    query["include"] = {
      model: PackageOffers,
      as: "prices",
      attributes: ["id", "perMonthPrice", "discountType", "discount", "tenure"],
      where: {
        status: "Active",
      },
      order: [["perMonthPrice", "asc"]],
    };
    let data = await Packages.findOne(query);

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
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export async function getOfferById(req, res, next) {
  let query = {};

  try {
    query["where"] = { packageID: req.params.packageId, id: req.params.id };
    if (!req?.user) query["where"]["status"] = "Active";
    query["attributes"] = [
      "id",
      "packageId",
      "icon",
      "title",
      "perMonthPrice",
      "discription",
      "support",
      "userLimit",
      "customerLimit",
      "installationLimit",
      "rentalLimit",
      "servicesLimit",
      "projectLimit",
      "supplierLimit",
      "createdAt",
      "status",
    ];

    query["include"] = {
      model: PackageOffers,
      as: "prices",
      attributes: ["id", "perMonthPrice", "discountType", "discount", "tenure"],
      where: {
        status: "Active",
      },
      order: [["perMonthPrice", "asc"]],
    };
    let data = await Packages.findOne(query);

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

export async function deletePackage(req, res, next) {
  try {
    let data = await Packages.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (data) {
      res.status(200).send({
        status: "success",
        message: "Package deleted successfully",
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

export async function deleteOffer(req, res, next) {
  try {
    let data = await PackageOffers.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (data) {
      res.status(200).send({
        status: "success",
        message: "Offer deleted successfully",
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

export async function deleteService(req, res, next) {
  try {
    let data = await PackageServices.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (data) {
      res.status(200).send({
        status: "success",
        message: "Service deleted successfully",
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
