const yup = require('yup');

module.exports = async (payload, create = true) => {
    const schema = yup.object().shape({
        name: yup.string().required(),
        slug: yup.string(),
        description: yup.string(),
    }).noUnknown();

    return schema.validate(payload, {
        abortEarly: false,
        stripUnknown: true,
    });
};
