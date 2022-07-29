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

    allWithOneAuthor: async function(filter = {}) {
        const books = await this.all(filter);

        // Parse book data
        books.data = await Promise.all((books.data || []).map(async book => {
            const authors = await this.getAuthors(book.attributes.slug);
            const  authorsData = authors.data || [];
            
            book.attributes.author = authorsData[0] || {};

            return book;
        }));

        return books;
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

    deleteAllCategories: async function(token, slug) {
        const categories = await this.getCategories(slug);
        
        if (categories.data) {
            categories.data.forEach(async category => {
                await this.deleteCategory(token, slug, category.attributes.slug);
            }); 
        }
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

    deleteAllAuthors: async function(token, slug) {
        const authors = await this.getAuthors(slug);
        
        if (authors.data) {
            authors.data.forEach(async author => {
                await this.deleteAuthor(token, slug, author.attributes.slug);
            }); 
        }
    },
};
