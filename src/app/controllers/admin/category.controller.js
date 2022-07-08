module.exports = {
    index: async (req, res) => {
        res.render('admin/categories/index', {
            layout: 'admin',
            title: 'Categories'
        });
    },

    create: async (req, res) => {
        res.render('admin/categories/create', {
            layout: 'admin',
            title: 'New Category'
        });
    },

    edit: async (req, res) => {
        res.render('admin/categories/edit', {
            layout: 'admin',
            title: 'Edit Category'
        });
    },
};
