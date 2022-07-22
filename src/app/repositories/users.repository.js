const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const urlUtil = require('../../utils/url.util');
const formUtil = require('../../utils/form.util');
const { api: apiConfig } = require('../../config');

const endpoint = 'users';

module.exports = {
    all: async (token, filter = {}) => {
        filter = urlUtil.parseQuery(filter);

        const response = await fetch(`${apiConfig.url}/${endpoint}?${filter}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.json();
    },

    find: async (token, id) => {
        const response = await fetch(`${apiConfig.url}/${endpoint}/${id}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.json();
    },

    create: async (token, payload, files) => {
        const form = formUtil.parse(payload, files);

        const response = await fetch(`${apiConfig.url}/${endpoint}`, {
            method: 'POST',
            mode: 'cors',
            body: form,
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.status === 201;
    },

    update: async (token, id, payload, files) => {
        const form = formUtil.parse(payload, files);

        const response = await fetch(`${apiConfig.url}/${endpoint}/${id}`, {
            method: 'PUT',
            mode: 'cors',
            body: form,
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.status === 200;
    },

    delete: async (token, id) => {
        const response = await fetch(`${apiConfig.url}/${endpoint}/${id}`, {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.status === 200;
    },
};
