module.exports = {
    index: async (req, res) => {
        res.render('admin/books/index', {
            layout: 'admin',
            title: 'Books'
        });
    },

    create: async (req, res) => {
        res.render('admin/books/create', {
            layout: 'admin',
            title: 'New Book'
        });
    },

    edit: async (req, res) => {
        res.render('admin/books/edit', {
            layout: 'admin',
            title: 'Edit Book'
        });
    },
};
