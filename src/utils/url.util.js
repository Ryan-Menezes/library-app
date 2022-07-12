module.exports = {
    parseQuery: (obj) => Object.keys(obj).map(key => `${key}=${obj[key]}`).join('&'),
};
