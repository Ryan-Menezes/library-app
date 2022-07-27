const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const urlUtil = require('../../utils/url.util');
const formUtil = require('../../utils/form.util');
const { api: apiConfig } = require('../../config');

const endpoint = 'authors';

module.exports = {
    all: async (filter = {}) => {
        filter = urlUtil.parseQuery(filter);

        const response = await fetch(`${apiConfig.url}/${endpoint}?${filter}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
        });

        return response.json();
    },

    find: async (slug) => {
        const response = await fetch(`${apiConfig.url}/${endpoint}/${slug}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
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

        const status = response.status;
        const response_json = await response.json();

        return { status, response: response_json };
    },

    update: async (token, slug, payload, files) => {
        const form = formUtil.parse(payload, files);

        const response = await fetch(`${apiConfig.url}/${endpoint}/${slug}`, {
            method: 'PUT',
            mode: 'cors',
            body: form,
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${token}`,
            },
        });

        const status = response.status;
        const response_json = await response.json();

        return { status, response: response_json };
    },

    delete: async (token, slug) => {
        const response = await fetch(`${apiConfig.url}/${endpoint}/${slug}`, {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.status === 200;
    },

    // -----------------------------
    // BOOKS
    // -----------------------------
    getBooks: async (slug, filter = {}) => {
        filter = urlUtil.parseQuery(filter);

        const response = await fetch(`${apiConfig.url}/${endpoint}/${slug}/books?${filter}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
        });

        return response.json();
    },
};
