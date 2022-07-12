const formidable = require('formidable');
const { promisify } = require('util');

const form = new formidable.IncomingForm();

module.exports = {
    parse: async (req) => promisify(form.parse)(req),
};
