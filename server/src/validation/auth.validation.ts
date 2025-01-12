import Joi from "joi";

export const loginFormValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Bạn chưa nhập email",
    "string.email": "Email không đúng định dạng",
  }),
  password: Joi.string().required().messages({
    "any.required": "Bạn chưa nhập password",
    "string.min": "Mật khẩu phải trên 6 kí tự",
  }),
});

export const registerForm = Joi.object({
  userName: Joi.string().required().messages({
    "any.required": "Bạn chưa nhập tên đăng nhập",
  }),
  password: Joi.string().required().min(6).messages({
    "any.required": "Bạn chưa nhập mật khẩu",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "Bạn chưa nhập email",
    "string.email": "Email không đúng định dạng",
  }),
  forgotPassword: Joi.string().required().messages({
    "any.required": "Bạn chưa nhập nhập lại mật khẩu",
  }),
});

export const socialUserValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Bạn chưa nhập email",
    "string.email": "Email không đúng định dạng",
  }),
  first_name: Joi.string().required().messages({
    "any.required": "Bạn chưa nhập họ ",
  }),
  last_name: Joi.string().required().messages({
    "any.required": "Bạn chưa nhập tên",
  }),
  full_name: Joi.string().required().messages({
    "any.required": "Bạn chưa nhập họ tên",
  }),
  picture: Joi.string().required().messages({
    "any.required": "Bạn chưa nhập ảnh",
  }),
  uid: Joi.string().required().messages({
    "any.required": "Bạn chưa nhập uuid",
  }),
  provider: Joi.string().required().messages({
    "any.required": "Bạn chưa nhập loại đăng nhập",
  }),
});

export const changePassValidation = Joi.object({
  passwordOld: Joi.string().min(6).required().messages({}),
  passwordNew: Joi.string().min(6).required().messages({}),
  confirmPassword: Joi.string()
    .min(6)
    .valid(Joi.ref("passwordNew"))
    .required()
    .messages({
      "any.only": "Nhập lại mật khẩu không đúng",
    }),
});
