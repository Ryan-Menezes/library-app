module.exports = {
    index: async (req, res) => {
        res.render('site/books/index', {
            title: 'Books'
        });
    },
};
