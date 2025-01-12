import Joi from "joi";

export const addressValidation = Joi.object({
  username: Joi.string().required().messages({
    "any.required": "Bạn chưa nhập tên người nhận",
  }),
  phone: Joi.string().required().length(10).messages({
    "any.required": "Bạn chưa nhập số điện thoại người nhận",
  }),
  city: Joi.object({
    name: Joi.string().required(),
    idProvince: Joi.string().required(),
  }),
  district: Joi.object({
    name: Joi.string().required(),
    idDistrict: Joi.string().required(),
  }),
  commune: Joi.object({
    name: Joi.string().required(),
    idCommune: Joi.string().required(),
  }),
  address: Joi.string().required(),
  detailAddress: Joi.string().required(),
  location: Joi.array().items(Joi.number()),
});
