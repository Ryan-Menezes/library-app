module.exports = {
    index: async (req, res) => {
        res.render('site/index', {
            title: 'Your library online'
        });
    },
};
