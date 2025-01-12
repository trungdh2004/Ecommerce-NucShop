import Joi from "joi";

export const TagsValidation = Joi.object({
  name: Joi.string().required().messages({}),
  description: Joi.string().required().messages({}),
});

export const BlogValidation = Joi.object({
  title: Joi.string().required().messages({
    "any.required": "Bạn chưa nhập tiêu đề cho bài viết",
  }),
  content: Joi.string().required().messages({
    "any.required": "Bạn chưa nhập nội dung bài viết",
  }),
  thumbnail_url: Joi.string().required().messages({
    "any.required": "Bạn chưa chọn ảnh bài viết",
  }),
  published_at: Joi.string().optional(),
  selected_tags: Joi.array().items(
    Joi.object({
      name: Joi.string(),
      _id: Joi.string(),
    })
  ),
});
