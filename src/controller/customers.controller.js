const { sequelize, Users } = require("../models");
import { Op } from "sequelize";
import PasswordHashing from "../utlis/password-hashing";
import logger from "../config/winston";
import { createAccesstoken } from "../utlis/jwt";
import Mail from "../services/mail";
import {generateID} from "../utlis/generate-id";

export async function checkUserStatus(req, res, next) {
  try {
    const userStored = await Users.findOne({
      where: {
        id: req.user.id,
      },
    });
    if (!userStored) {
      return res
        .status(200)
        .send({ status: "error", message: "User not found" });
    }

    if (!userStored.email_varified) {
      res.status(200).send({
        status: "error",
        statusType: "notVerified",
        message: "Email is not verified",
      });
    } else {
      res.status(200).send({
        status: "success",
        // accessToken: createAccesstoken(userStored),
        // refreshToken: jwt.createRefreshToken(userStored),
        user: {
          id: userStored.id,
          user_id: userStored.user_id,
          first_name: userStored.first_name,
          last_name: userStored.last_name,
          email_address: userStored.email_address,
          user_role: userStored.user_role,
          user_type: userStored.user_type,
          user_avatar: userStored.user_avatar,
        },
      });
    }
  } catch (error) {
    next(error);
  }
}
      
export async function logIn(req, res, next) {
  const params = req.body;
  const email = params.email.trim().toLowerCase();
  const password = params.password.trim();
  try {
    let userStored = await Users.findOne({
      where: {
        email_address: email,
        status: "Active",
        user_type: "Customer",
      },
    });

    if (!userStored) {
      return res
        .status(200)
        .send({ status: "error", message: "User not found" });
    }
    PasswordHashing.comparePassword(
      password,
      userStored.user_password,
      (err, check) => {
        if (err) {
          logger.log(err);
          res.status(500).send({ status: "error", message: "Server error" });
        } else if (!check) {
          res
            .status(200)
            .send({ status: "error", message: "Password is incorrect" });
        } else {
          if (!userStored.email_varified) {
            /// Send otp On Mail START
            SendOtp(userStored.email_address);
            /// Send otp On Mail END

            res.status(200).send({
              status: "error",
              statusType: "notVerified",
              message: "Email is not verified",
            });
          } else {
            res.status(200).send({
              status: "success",
              accessToken: createAccesstoken(userStored),
              // refreshToken: jwt.createRefreshToken(userStored),
              user: {
                id: userStored.id,
                user_id: userStored.user_id,
                first_name: userStored.first_name,
                last_name: userStored.last_name,
                email_address: userStored.email_address,
                user_role: userStored.user_role,
                user_avatar: userStored.user_avatar,
              },
            });
          }
        }
      }
    );
  } catch (error) {
    next(error);
  }
}

/////// Verify OTP ///////
export async function verifyOtp(req, res, next) {
  const params = req.body;

  const email = params.email.trim().toLowerCase();
  const otp = params.otp.trim();

  try {
    let userStored = await Users.findOne({
      where: {
        email_address: email,
        user_type: "Customer",
        status: "Active",
      },
    });

    if (!userStored) {
      return res
        .status(200)
        .send({ status: "error", message: "User not found" });
    }

    if (Number(userStored.otp_code) != Number(otp)) {
      res.status(200).send({
        status: "error",
        message: "OTP not matched",
      });
    } else if (
      userStored.otp_expire < Math.floor(new Date().getTime() / 1000)
    ) {
      res.status(200).send({
        status: "error",
        message: "OTP expired!",
      });
    } else {
      Users.update(
        { email_varified: true },
        { where: { id: userStored.id }, individualHooks: true }
      );

      res.status(200).send({
        status: "success",
        message: "Emial verified successfully",
        accessToken: createAccesstoken(userStored),
        // refreshToken: jwt.createRefreshToken(userStored),
        user: {
          id: userStored.id,
          user_id: userStored.user_id,
          first_name: userStored.first_name,
          last_name: userStored.last_name,
          email_address: userStored.email_address,
          user_avatar: userStored.user_avatar,
          user_role: userStored.user_role,
          user_avatar: userStored.user_avatar,
        },
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function signUpCustomer(req, res, next) {
  try {
    let userStored = await Users.findOne({
      where: {
        email_address: req.body.email_address,
        status: "Active",
        user_type: "Customer",
      },
    });

    if (userStored) {
      return res
        .status(200)
        .send({ status: "error", message: "Email already registered!" });
    }
    if (req.file)
      req.body.user_avatar = global.config.userAvatarPath + "/" + req.file.filename;

    // Generate User ID
    req.body.user_id = generateID("PEU");
    req.body.user_role = "Customer";
    req.body.user_type = "Customer";
    let newUser = await Users.create(req.body);

    delete newUser.user_password;

    /// Send otp On Mail START
    SendOtp(newUser.email_address);
    /// Send otp On Mail END

    res.status(200).send({
      status: "success",
      message: "Sign Up successfully",
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
}

export async function createCustomer(req, res, next) {
  try {
    // Generate User ID
    req.body.user_id = generateID("PEU");
    req.body.user_role = "Customer";
    req.body.user_type = "Customer";
    req.body.createdBy = req.user.id;
    let newUser = await Users.create(req.body);

    delete newUser.user_password;
    res.status(200).send({
      status: "success",
      message: "Customer Created successfully",
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateCustomer(req, res, next) {
  const userID = req.params.id;
  req.body.user_role = "Customer";
  req.body.user_type = "Customer";

  if (req?.body?.email_address) delete req.body.email_address;
  try {
    if (req.file)
      req.body.user_avatar = global.config.userAvatarPath + req.file.filename;
    let newUser = await Users.update(req.body, {
      where: { id: userID },
    });

    delete newUser.user_password;
    res.status(200).send({
      status: "success",
      message: "User update successfully",
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateCustomerStatus(req, res, next) {
  const userID = req.params.id;
  try {
    let newUser = await Users.update(
      { status: req.body.status },
      { where: { id: userID } }
    );

    res.status(200).send({
      status: "success",
      message: `User ${req.body.status} successfully`,
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req, res, next) {
  const userID = req.params.id;

  try {
    let data = await Users.destroy({
      where: {
        id: userID,
      },
    });

    if (data) {
      res.status(200).send({
        status: "success",
        message: "User deleted successfully",
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

export async function getCustomers(req, res, next) {
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
      user_type: "Customer",
    };

    if (req.query?.search) {
      query["where"][Op.or] = [
        { user_id: { [Op.like]: "%" + req.query?.search + "%" } },
        { first_name: { [Op.like]: "%" + req.query?.search + "%" } },
        { last_name: { [Op.like]: "%" + req.query?.search + "%" } },
        { email_address: { [Op.like]: "%" + req.query?.search + "%" } },
        { phone_number: { [Op.like]: "%" + req.query?.search + "%" } },
      ];
    }

    // If some query filter
    if (req.query?.where) {
      query["where"] = { ...query["where"], ...req.query.where };
    }

    //// Select attributes
    query["attributes"] = [
      "id",
      "user_id",
      "first_name",
      "last_name",
      "email_address",
      "phone_number",
      "user_avatar",
      "status",
    ];
    let data = await Users.findAndCountAll(query);

    res.status(200).send({
      status: "success",
      message: "",
      total: data.count,
      data: data.rows,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function getCustomerById(req, res, next) {
  let query = {};

  try {
    query["where"] = { id: req.params.id, status: "Active" };
    query["attributes"] = [
      "id",
      "user_id",
      "first_name",
      "last_name",
      "email_address",
      "user_avatar",
      "phone_number",
    ];
    let data = await Users.findOne(query);

    if (!data) {
      return res.status(404).send({
        status: "error",
        message: "No User Found!",
        data: data,
      });
    }
    res.status(200).send({
      status: "success",
      message: "",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export function sendOTPFn(req, res, next) {
  try {
    SendOtp(req.body.email);
    res.status(200).send({
      status: "success",
      message: "OTP sent to your registerd mail",
    });
  } catch (error) {
    next(error);
  }
}

/// Send OTP on Mail
function SendOtp(email) {
  const emailData = {
    to: email,
    subject: "One Time Password",
  };

  const otp = Math.floor(1000 + Math.random() * 9000);

  return new Promise((resolve, reject) => {
    Users.update(
      {
        otp_code: otp,
        otp_expire: Math.floor(new Date().getTime() / 1000) + 60 * 60,
      },
      { where: { email_address: email, status: "Active" } }
    )
      .then(async (data) => {
        return await Mail(emailData, { otp }, "send-otp.html");
      })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        logger.error(err);
        reject(err);
      });
  });
}

/////// Change Password ///////
export async function changePassword(req, res, next) {
  try {
    let newUser = await Users.update(
      {
        user_password: req.body.newPassword,
      },
      {
        where: { id: req.user.id },
        individualHooks: true,
      }
    );

    delete newUser.user_password;
    res.status(200).send({
      status: "success",
      message: "Password change successfully",
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
}

/////// Change Password ///////
export async function forgetPassword(req, res, next) {
  const params = req.body;

  const otp = params.otp.trim();
  const newPassword = params.newPassword.trim();

  try {
    let userStored = await Users.findOne({
      where: {
        email_address: req.body.email,
        otp_code: otp,
        status: "Active",
      },
    });

    if (!userStored) {
      return res
        .status(200)
        .send({ status: "error", message: "OTP not matched!" });
    }

    if (userStored.otp_expire < Math.floor(new Date().getTime() / 1000)) {
      res.status(200).send({
        status: "error",
        message: "OTP expired!",
      });
    } else {
      const data = await Users.update(
        { user_password: newPassword },
        { where: { email_address: req.body.email }, individualHooks: true }
      );

      res.status(200).send({
        status: "success",
        message: "Password update Successfully",
        data,
      });
    }
  } catch (error) {
    next(error);
  }
}
