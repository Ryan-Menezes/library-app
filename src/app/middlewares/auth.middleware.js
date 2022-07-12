const httpErrors = require('http-errors');

const { users: userRepository } = require('../repositories');

module.exports = async (req, res, next) => {
    if (!req.session || !req.session.admin) {
        return next(httpErrors.Unauthorized());
    }

    const admin = req.session.admin;
    const user = await userRepository.find(admin.token, admin.userId);

    if (user.statusCode) {
        return next(httpErrors.Unauthorized());
    }

    req.admin = { ...admin, user: user.data.attribute };
    next();
};
