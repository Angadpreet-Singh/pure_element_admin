const { sequelize, PromoCodes } = require("../models");
import { Op } from "sequelize";

export async function createPromo(req, res, next) {
  
  try {
    console.log(req.body)
    req.body.createdBy = req.user.id;
    let data = await PromoCodes.create(req.body);
    console.log(data)
    res.status(200).send({
      status: "success",
      message: "Promo Code Created successfully",
      data: data,
    });
  } catch (error) {
    next(error);
  }
}
 
export async function updatePromo(req, res, next) {

  try {
    
    let data = await PromoCodes.update(req.body, {
      where: { id: req.params.id },
    });

    res.status(200).send({
      status: "success",
      message: "Promo Code update successfully",
      data: data,
    });
  } catch (error) {
    next(error);
  }
}

export async function updatePromoStatus(req, res, next) {
  try {

    let data = await PromoCodes.update(
      { status: req.body.status },
      { where: { id: req.params.id } }
    );

    res.status(200).send({
      status: "success",
      message: `Promo Code ${req.body.status} successfully`,
      data: data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPromos(req, res, next) {
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
      }
    };

    if (req.query?.search) {
        query["where"][Op.or] = [
             {title: { [Op.like]: '%' + req.query?.search + '%' }},
             {promoCode: { [Op.like]: '%' + req.query?.search + '%' }},
             {description: { [Op.like]: '%' + req.query?.search + '%' }}
            ]
    }

    // If some query filter
    if(req.query?.where){
      query["where"] = {...query["where"], ...req.query.where};
    }

    //// Select attributes
    query['attributes'] = ['id', 'title', 'description', 'termsAndConditions', 'discount', 'discountType','promoCode', 'validFrom', 'expire', 'createdAt', 'status']
    let data = await PromoCodes.findAndCountAll(query);

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

export async function getPromoById(req,res, next){

  let query = {};

  try {
    query['where'] = { id: req.params.id }
    query['attributes'] = ['id', 'title', 'description', 'termsAndConditions', 'discount', 'discountType','promoCode', 'validFrom', 'expire', 'createdAt', 'status']
    let data = await PromoCodes.findOne(query);
    
    if(!data){
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

export async function deletePromo(req, res, next) {

  try {
    let data = await PromoCodes.destroy({
      where: {
        id: req.params.id,
      }
    });

    if (data) {
      res.status(200).send({
        status: "success",
        message: "Promo Code deleted successfully",
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