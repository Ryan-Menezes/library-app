const yup = require('yup');

module.exports = async (payload, create = true) => {
    let schema = {};

    if (create) {
        schema = yup.object().shape({
            first_name: yup.string().required(),
            last_name: yup.string().required(),
            username: yup.string().required(),
            password: yup.string().required().min(8),
        }).noUnknown();
    } else {
        schema = yup.object().shape({
            first_name: yup.string().required(),
            last_name: yup.string().required(),
            username: yup.string().required(),
            password: yup.string(),
        }).noUnknown();
    }

    return schema.validate(payload, {
        abortEarly: false,
        stripUnknown: true,
    });
};
