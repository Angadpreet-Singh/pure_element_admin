import { createTenentDashboard, connectDb } from "../utlis/domain-config";
import { check } from "express-validator";
import { cloneSourceFile, copyingSourceFile } from "../utlis/clone-source";
import {
  generateConfigFileFrontend,
  generateENVConfigFile,
  generateServerConfigFile,
} from "../utlis/generate-config";
import {
  testCommand,
  checkNginxServerConfigration,
  createFrontendBuild,
  packagesInstall,
  startExpressServer,
  startNginxServer,
  updateConfigFile,
  createSuperAdmin,
} from "../utlis/shell-command";
const {
  sequelize,
  Subscriptions,
  SubscriptionActivities,
} = require("../models");
import { Op } from "sequelize";
import { error } from "winston";
const moment = require("moment");


// export const generateSercerConfigFile = (req, res, next) => {
//   createTenentDashboard(req.body.serverName)
//     .then(() => {
//       res.status(200).send({
//         status: "success",
//         message: "Config file generated successfully",
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//       next({
//         status: "error",
//         message: "Something wents wrong, please try again!",
//         err,
//       });
//     });

// };

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// export const databasecreateion = (req, res, next) => {
//   connectDb(req.body.serverName)
//     .then(() => {
//       res.status(200).send({
//         status: "success",
//         message: "Database create  successfully",
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//       next({
//         status: "error",
//         message: "Something wents wrong, please try again!",
//         err,
//       });
//     });
// };

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// export const checkSubdomain = async (req, res, next) => {
//   try {
//     if (!req.query.subDomain) {
//       return next("subDomain is required");
//     }
//     let data = await Subscriptions.findOne({
//       where: { subDomain: req.query.subDomain, status: "Active" },
//     });
//     if (!data) {
//       return res.status(404).send({
//         status: "error",
//         message: "Sub domain is available",
//       });
//     }
//     res.status(200).send({
//       status: "success",
//       message: "Sub domain is already use",
//     });
//   } catch (error) {
//     next(error);
//   }
// };



export async function getSubscriptionsActivities(req, res, next) {
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

    if (req.query?.domain) {
      query["where"]["subDomain"] = req.query.domain;
    }
    if (req.query?.search) {
      query["where"][Op.or] = [
        { message: { [Op.like]: "%" + req.query?.search + "%" } },
        { activityStatus: { [Op.like]: "%" + req.query?.search + "%" } },
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
      "subDomain",
      "message",
      "activityStatus",
      "errorMessage",
      "apiLevel",
      "createdAt",
      "status",
    ];
    let data = await SubscriptionActivities.findAndCountAll(query);

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

export const copyFiles = async (req, res, next) => {
  try {
    await copyingSourceFile(req.body.serverName);


    // Save activity to database if copying files Successfully
    const activityData = {
      subDomain: req.body.serverName,
      message: `Successfully copy all files.`,
      apiLevel: 1,
      activityStatus: "success",
    };

    await SubscriptionActivities.create(activityData);
    res.status(200).send({
      status: "success",
      subDomain: req.body.serverName,
      message: `Successfully copy all files.`,
      apiLevel: 1,
      activityStatus: "success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      message: "Something wents wrong, please try again!",
      error,
      apiLevel: 1,
      activityStatus: "failed",
    });
  }
};

export const cloneSourceFiles = async (req, res, next) => {
  try {
    await cloneSourceFile(req.body.serverName);

    // Save activity to database if copying files Successfully
    const activityData = {
      subDomain: req.body.serverName,
      message: `Successfully copy all files.`,
      apiLevel: 1,
      activityStatus: "success",
    };

    await SubscriptionActivities.create(activityData);
    res.status(200).send({
      status: "success",
      subDomain: req.body.serverName,
      message: `Successfully copy all files.`,
      apiLevel: 1,
      activityStatus: "success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      message: "Something wents wrong, please try again!",
      error,
      apiLevel: 1,
      activityStatus: "failed",
    });
  }
};

export const generateAllConfigFiles = async (req, res, next) => {
  try {
    await generateENVConfigFile(req.body.serverName);
    await generateConfigFileFrontend(req.body.serverName);
    await generateServerConfigFile(req.body.serverName);
    // Save activity to database if copying files Successfully
    const activityData = {
      subDomain: req.body.serverName,
      message: `Successfully create environment.`,
      apiLevel: 2,
      activityStatus: "success",
    };

    await SubscriptionActivities.create(activityData);
    res.status(200).send({
      status: "success",
      subDomain: req.body.serverName,
      message: `Successfully create environment.`,
      apiLevel: 2,
      activityStatus: "success",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "error",
      message: "Something wents wrong, please try again!",
      err,
      apiLevel: 2,
      activityStatus: "failed",
    });
  }
};

export const installDependancies = async (req, res, next) => {
  try {
    await packagesInstall(req.body.serverName);
    // Save activity to database if copying files Successfully
    const activityData = {
      subDomain: req.body.serverName,
      message: `Successfully installed dependancies.`,
      apiLevel: 3,
      activityStatus: "success",
    };

    await SubscriptionActivities.create(activityData);
    res.status(200).send({
      status: "success",
      subDomain: req.body.serverName,
      message: `Successfully installed dependancies.`,
      apiLevel: 3,
      activityStatus: "success",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "error",
      message: "Something wents wrong, please try again!",
      err,
      apiLevel: 3,
      activityStatus: "failed",
    });
  }
};

export const generateBuild = async (req, res, next) => {
  try {
    await createFrontendBuild(req.body.serverName);
    // Save activity to database if copying files Successfully
    const activityData = {
      subDomain: req.body.serverName,
      message: `Successfully installed Configrations.`,
      apiLevel: 4,
      activityStatus: "success",
    };

    await SubscriptionActivities.create(activityData);
    res.status(200).send({
      status: "success",
      subDomain: req.body.serverName,
      message: `Successfully installed Configrations.`,
      apiLevel: 4,
      activityStatus: "success",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "error",
      message: "Something wents wrong, please try again!",
      err,
      apiLevel: 4,
      activityStatus: "failed",
    });
  }
};

export const startServer = async (req, res, next) => {
  try {
    await startExpressServer(req.body.serverName);
    // Save activity to database if copying files Successfully
    const activityData = {
      subDomain: req.body.serverName,
      message: `Successfully finish Configrations.`,
      apiLevel: 5,
      activityStatus: "success",
    };

    await SubscriptionActivities.create(activityData);
    res.status(200).send({
      status: "success",
      subDomain: req.body.serverName,
      message: `Successfully finish Configrations.`,
      apiLevel: 5,
      activityStatus: "success",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "error",
      message: "Something wents wrong, please try again!",
      err,
      apiLevel: 5,
      activityStatus: "failed",
    });
  }
};

export const setupUser = async (req, res, next) => {
  try {
    await createSuperAdmin(req.body.serverName);
    // Save activity to database if copying files Successfully
    const activityData = {
      subDomain: req.body.serverName,
      message: `Successfully created user.`,
      apiLevel: 6,
      activityStatus: "success",
    };

    await SubscriptionActivities.create(activityData);
    res.status(200).send({
      status: "success",
      subDomain: req.body.serverName,
      message: `Successfully create user.`,
      apiLevel: 6,
      activityStatus: "success",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "error",
      message: "Something wents wrong, please try again!",
      err,
      apiLevel: 6,
      activityStatus: "failed",
    });
  }
};

export const finishing = async (req, res, next) => {
  try {
    await updateConfigFile(req.body.serverName);
    await checkNginxServerConfigration(req.body.serverName);
    setTimeout(() => {
      startNginxServer(req.body.serverName);
    }, 1000);
    // Save activity to database if copying files Successfully
    const activityData = {
      subDomain: req.body.serverName,
      message: `Successfully finish Configrations.`,
      apiLevel: 7,
      activityStatus: "success",
    };

    await SubscriptionActivities.create(activityData);
    res.status(200).send({
      status: "success",
      subDomain: req.body.serverName,
      message: `Successfully finish Configrations.`,
      apiLevel: 7,
      activityStatus: "success",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "error",
      message: "Something wents wrong, please try again!",
      err,
      apiLevel: 7,
      activityStatus: "failed",
    });
  }
};

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const checkSubdomain = async (req, res, next) => {
  try {
    if (req?.query?.subDomain === "api") {
      return res.status(404).send({
        status: "false",
        message: "Domain is not available",
      });
    }
    let data = await Subscriptions.findOne({
      where: { subDomain: req.query.subDomain, status: "Active" },
    });
    if (!data) {
      return res.status(200).send({
        status: "success",
        message: "Sub domain is available",
        data: data,
      });
    }
    res.status(404).send({
      status: "error",
      message: "Sub domain is already use",
      data,
    });
  } catch (error) {
    next(error);
  }
};
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export const testCommandApi = async (req, res, next) => {
  try {
    const test = await testCommand(req.body.path, req.body.command);
    res.status(200).send({
      status: "success",
      result: test,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "error",
      err,
    });
  }
};

// xxxxxxxxxxxxxxxxxxxxxxxxxx  Check Subscription XXXXXXXXXXXXXXXXX

export const checkSubscription = async (req, res, next) => {
  try {
    const origin = req.headers.origin.replace(/(^\w+:|^)\/\//, '');
    let data = await Subscriptions.findOne({
      where: {
        domain: origin,
      },
    });
    if (data) {
      // const expireDate = moment(data.expireDate).utc().format("Y-MM-DD");
      // const todayDate = moment(new Date()).utc().format("Y-MM-DD");
      if (data.status === "Inactive") {
        return res.status(403).send({
          status: "false",
          company: data.companayName,
          message: "Your subscription is deactivated, contact us for support.",
        });
      } else {
        return res.status(200).send({
          status: "success",
          company: data.companayName,
          subscriptionId: data.subscriptionId,
        });
      }
    }
    res.status(200).send({
      status: "success",
      message: "Subscription not found.",
    });
  } catch (error) {
    next(error);
  }
};




