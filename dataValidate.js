import Joi from "@hapi/joi";

const registerValidation=(data)=>{
    const Schema=Joi.object({
        name:Joi.string().required(),
        email:Joi.string().required().email(),
        phone:Joi.number().required(),
        work:Joi.string().required(),
        password:Joi.string().required().min(6),
        cpassword:Joi.string().required().min(6),
    });
    return Schema.validate(data);
};
const signinValidation=(data)=>{
    const Schema=Joi.object({
        email:Joi.string().required().email(),
        password:Joi.string().required().min(6)
    });
    return Schema.validate(data);
};

export {registerValidation,signinValidation};