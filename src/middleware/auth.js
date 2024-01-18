import { decodeToken } from '../utlis/jwt';
const { Users } = require("../models");

export const ensureAuth = (...role) => {

  return function(req, res, next){

  if (!req.headers.authorization && role.includes("Guest")) {
    return next();
  }    
  if (!req.headers.authorization) {
    return res
      .status(403)
      .send({ status:"error", message: "The request does not have an Authentication header." });
  }

  // Remove Bearer from string
  const token = req.headers.authorization.replace(/^Bearer\s+/, "");

  try {
    var payload = decodeToken(token);
    if (payload.expiresIn < Math.floor(new Date().getTime() / 1000)) {
      return res.status(401).send({ status:"error", message: "Token Expired" });
    }
  } catch (ex) {
    return res.status(401).send({ status:"error", message: "Invalid Token" });
  }

  Users.findOne({
    where: {
       id: payload.id,
       status: 'Active'
    }
 })
 .then((user)=>{
    if (!user) {
        return res.status(404).send({ status:"error", message: "Invalid User" });
    }

    if(!role.includes(payload.user_role) && payload.user_role !== "Admin"){
      return res.status(403).send({ status:"error", message: "Access Denied" });
    }
    req.user = payload;
    return next();
 })
 .catch((err)=>{
  res.status(404).send({ status:"error", message: "Server Error", result:err })
 })

};
};