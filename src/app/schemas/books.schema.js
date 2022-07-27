const yup = require('yup');

module.exports = async (payload) => {
    const schema = yup.object().shape({
        title: yup.string().required(),
        slug: yup.string(),
        visible: yup.boolean().default(false),
        volume: yup.number().required(),
        edition: yup.number().required(),
        pages: yup.number().required(),
        language: yup.string(),
        release_date: yup.date().required(),
        description: yup.string(),
        details: yup.string(),
    }).noUnknown();

    return schema.validate(payload, {
        abortEarly: false,
        stripUnknown: true,
    });
};
