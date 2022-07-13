const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const { api: apiConfig } = require('../../config');

module.exports = {
    login: async (username, password) => {
        const response = await fetch(`${apiConfig.url}/login`, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
        });

        return response.json();
    },

    logout: async (token) => {
        const response = await fetch(`${apiConfig.url}/logout`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.json();
    },
};
