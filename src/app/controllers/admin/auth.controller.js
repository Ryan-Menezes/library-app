module.exports = {
    login: async (req, res) => {
        res.render('admin/auth/login', {
            layout: false,
            title: 'Login'
        });
    },
};
