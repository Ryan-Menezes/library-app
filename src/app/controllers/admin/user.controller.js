module.exports = {
    index: async (req, res) => {
        res.render('admin/users/index', {
            layout: 'admin',
            title: 'Users'
        });
    },

    create: async (req, res) => {
        res.render('admin/users/create', {
            layout: 'admin',
            title: 'New User'
        });
    },

    edit: async (req, res) => {
        res.render('admin/users/edit', {
            layout: 'admin',
            title: 'Edit User'
        });
    },
};
