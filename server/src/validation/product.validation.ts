import Joi from "joi";

export const sizeValidation = Joi.object({
  name: Joi.string().required().messages({}),
  toHeight: Joi.number().required().messages({}),
  fromHeight: Joi.number().required().messages({}),
  toWeight: Joi.number().required().messages({}),
  fromWeight: Joi.number().required().messages({}),
});

export const colorValidation = Joi.object({
  name: Joi.string().required().messages({}),
  code: Joi.string().required().messages({}),
});
export const categoryValidation = Joi.object({
  name: Joi.string().required().messages({}),
  description: Joi.string().required().messages({}),
  thumbnail:Joi.string().required().messages({}),
});

export const productValidations = Joi.object({
  _id: Joi.string().optional(),
  name: Joi.string().required().messages({}),
  price: Joi.number().required().messages({}),
  discount: Joi.number().required().messages({}),
  description: Joi.string().required().messages({}),
  thumbnail: Joi.string().required().messages({}),
  category: Joi.string().required().messages({}),
  images: Joi.array().items(
    Joi.object({
      url: Joi.string().required().messages({}),
      _id: Joi.string().optional(),
    })
  ),
  is_hot:Joi.boolean().optional(),
  is_simple:Joi.boolean().optional(),
  attributes: Joi.array().items(
    Joi.object({
      color: Joi.string().required().messages({}),
      size: Joi.string().required().messages({}),
      price: Joi.number().required().messages({}),
      quantity: Joi.number().required().messages({}),
      discount: Joi.number().required().messages({}),
      createdAt: Joi.date().optional(),
      _id: Joi.string().allow(null).optional(),
      updatedAt: Joi.date().optional(),
      __v: Joi.number().optional(),
    })
  ),
  quantitySold: Joi.number().optional(),
  quantity: Joi.number().optional(),
  featured: Joi.boolean().optional(),
});

export const productSliderValidation = Joi.object({
  title: Joi.string().required().messages({}),
  label: Joi.string().required().messages({}),
  index: Joi.number().required().messages({}),
  product: Joi.string().required().messages({}),
  colorCode: Joi.string().required().messages({}),
});

export const categoryActiveValidation = Joi.object({
  index: Joi.number().required().messages({}),
  category: Joi.string().required().messages({}),
});
