import Joi from "joi";

export const shipperValidation = Joi.object({
    firstName:Joi.string().required().messages({}),
    lastName:Joi.string().required().messages({}),
    fullName:Joi.string().required().messages({}),
    birthDate:Joi.string().required().messages({}),
    address:Joi.string().required().messages({}),
    idCitizen:Joi.string().required().messages({}),
    avatar:Joi.string().required().messages({}),
    phone:Joi.string().required().messages({}),
});
