module.exports = {
    index: async (req, res) => {
        res.render('admin/authors/index', {
            layout: 'admin',
            title: 'Authors'
        });
    },

    create: async (req, res) => {
        res.render('admin/authors/create', {
            layout: 'admin',
            title: 'New Author'
        });
    },

    edit: async (req, res) => {
        res.render('admin/authors/edit', {
            layout: 'admin',
            title: 'Edit Author'
        });
    },
};
