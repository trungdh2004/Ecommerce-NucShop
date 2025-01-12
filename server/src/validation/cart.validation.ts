import Joi from "joi";


export const cartItemValidation = Joi.object({
  productId: Joi.string().required().messages({
    "any.required": "Bạn chưa nhập tiêu đề cho bài viết",
  }),
  quantity: Joi.number().required().messages({
    "any.required": "Bạn chưa chọn ảnh bài viết",
  }),
  attribute:Joi.string().allow(null).messages({}),
  is_simple:Joi.boolean()
});
