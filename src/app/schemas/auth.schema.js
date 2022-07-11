const yup = require('yup');

module.exports = async (payload) => {
    const schema = yup.object().shape({
        username: yup.string().required(),
        password: yup.string().required(),
    }).noUnknown();

    return schema.validate(payload, {
        abortEarly: false,
        stripUnknown: true,
    });
};
