const { api: apiConfig } = require('../../config');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
    login: async (username, password) => {
        const response = await fetch(`${apiConfig.url}/login`, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.json();
    },

    logout: async (token) => {
        const response = await fetch(`${apiConfig.url}/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.json();
    },
};
