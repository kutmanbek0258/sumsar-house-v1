'use strict';

const faq = require('../models/faq');

/**
 *
 * @param title
 * @param content
 * @param contacts
 * @param link
 * @param callback
 * @param error
 * @returns {Promise<void>}
 */
exports.addFAQ = async function(title, content, contacts, link, callback, error){
    const newFAQ = new faq({

        title: title,
        content: content,
        contacts: contacts,
        link: link,
        created_at: new Date()

    });

    await newFAQ.save()

        .then(() => callback({ status: 200, message: title }))

        .catch(() => error({ status: 500, message: 'Internal Server Error !' }));
};

/**
 *
 * @param callback
 * @param error
 * @returns {Promise<void>}
 */
exports.getFAQ = async function(callback, error){
    await faq.findOne()

        .then(faq => callback({ status: 200, faq: faq }))

        .catch(() => error({ status: 500, message: 'Internal Server Error !' }));
};

/**
 *
 * @param id
 * @param callback
 * @param error
 * @returns {Promise<void>}
 */
exports.removeFAQ = async function(id, callback, error){
    faq.deleteOne({ _id: id })

        .then(() => callback({ status: 200, message: 'Success deleted !' }))

        .catch(() => error({ status: 500, message: 'Internal Server Error !' }));
};