const fs = require('fs');
const FormData = require('form-data');

module.exports = {
    parse: (payload, files) => {
        const form = new FormData();
        
        Object.keys(payload).forEach(key => form.append(key, payload[key].toString()));
        Object.keys(files).forEach(async key => {
            const file = files[key];

            if (!Array.isArray(file) && file.size) {
                const buffer = fs.readFileSync(file.filepath);

                form.append(key, buffer, {
                    contentType: file.mimetype,
                    filename: file.originalFilename,
                });
            }
        });

        return form;
    },
};
