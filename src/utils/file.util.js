const formidable = require('formidable');

const form = new formidable.IncomingForm({ multiples: true });

module.exports = {
    parse: async (req) => {
        return new Promise((resolve, reject) => {
            form.parse(req, (error, fields, files) => {
                if (error) {
                    reject(error);
                }

                resolve({ fields, files });
            });
        });
    },
};
