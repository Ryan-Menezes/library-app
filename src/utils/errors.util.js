module.exports = {
    treatRequest: async (req, res, schema, redirect = '/') => {
        try {
            return await schema(req.body, !Boolean(req.params.id));
        } catch (e) {
            const errors = e.errors || [ e.message ];

            req.flash('errors', errors);

            return res.redirect(redirect);
        }
    },
};
