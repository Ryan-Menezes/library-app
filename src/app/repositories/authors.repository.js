const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const urlUtil = require('../../utils/url.util');
const formUtil = require('../../utils/form.util');
const { api: apiConfig } = require('../../config');

const endpoint = 'authors';

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

    find: async (token, slug) => {
        const response = await fetch(`${apiConfig.url}/${endpoint}/${slug}`, {
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
            body: form,
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.status === 201;
    },

    update: async (token, slug, payload, files) => {
        const form = formUtil.parse(payload, files);

        const response = await fetch(`${apiConfig.url}/${endpoint}/${slug}`, {
            method: 'PUT',
            body: form,
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.status === 200;
    },

    delete: async (token, slug) => {
        const response = await fetch(`${apiConfig.url}/${endpoint}/${slug}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.status === 200;
    },
};
