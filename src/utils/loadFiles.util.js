const fs = require('fs');
const path = require('path');

module.exports = (dir, filename) => {
    const paths = {};
    fs.readdirSync(dir).forEach(file => {
        const name = file.replace(/\..*/ig, '');
        const path_file = path.join(dir, file);

        if (filename != path_file && file != '.' && file != '..') {
            paths[name] = require(path_file);
        }
    });

    return paths;
};
