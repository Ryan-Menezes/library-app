const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const urlUtil = require('../../utils/url.util');
const formUtil = require('../../utils/form.util');
const { api: apiConfig } = require('../../config');

const endpoint = 'books';

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
        const json = await response.json();

        return { status, response: json };
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

        return response.status === 200;
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
    // IMAGES
    // -----------------------------
    getImages: async (slug) => {
        const response = await fetch(`${apiConfig.url}/${endpoint}/${slug}/images`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
        });

        return response.json();
    },

    addImage: async (token, slug, files) => {
        const form = formUtil.parse({}, files);

        const response = await fetch(`${apiConfig.url}/${endpoint}/${slug}/images`, {
            method: 'POST',
            mode: 'cors',
            body: form,
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${token}`,
            },
        });
        
        return response.status === 200;
    },

    deleteImage: async (token, slug, filename) => {
        const response = await fetch(`${apiConfig.url}/${endpoint}/${slug}/images/${filename}`, {
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
    // CATEGORIES
    // -----------------------------
    getCategories: async (slug) => {
        const response = await fetch(`${apiConfig.url}/${endpoint}/${slug}/categories`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
        });

        return response.json();
    },

    addCategory: async (token, slug, slug_category) => {
        const response = await fetch(`${apiConfig.url}/${endpoint}/${slug}/categories/${slug_category}`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${token}`,
            },
        });
        
        return response.status === 200;
    },

    deleteCategory: async (token, slug, slug_category) => {
        const response = await fetch(`${apiConfig.url}/${endpoint}/${slug}/categories/${slug_category}`, {
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
    // AUTHORS
    // -----------------------------
    getAuthors: async (slug) => {
        const response = await fetch(`${apiConfig.url}/${endpoint}/${slug}/authors`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
        });

        return response.json();
    },

    addAuthor: async (token, slug, slug_author) => {
        const response = await fetch(`${apiConfig.url}/${endpoint}/${slug}/authors/${slug_author}`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${token}`,
            },
        });
        
        return response.status === 200;
    },

    deleteAuthor: async (token, slug, slug_author) => {
        const response = await fetch(`${apiConfig.url}/${endpoint}/${slug}/authors/${slug_author}`, {
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
