import Joi from "joi";

export const voucherValidation = Joi.object({
  name: Joi.string().required().messages({}),
  description: Joi.string().required().messages({}),
  startDate: Joi.string().required().messages({}),
  endDate: Joi.string().required().messages({}),
  discountType: Joi.number().required().messages({}),
  discountValue: Joi.number().required().messages({}),
  usageLimit: Joi.number().required().messages({}),
  minimumOrderValue: Joi.number().required().messages({}),
  code: Joi.string().length(7).required().messages({}),
  type: Joi.string().required().messages({}),
  listUseProduct: Joi.array().items(Joi.string()).optional(),
  maxAmount:Joi.number().required().messages({}),
});
