module.exports = {
    index: async (req, res) => {
        res.render('admin/index', {
            layout: 'admin',
            title: 'Home'
        });
    },
};
