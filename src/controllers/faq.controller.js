'use strict';

const { faqService: {
    addFAQ,
    getFAQ,
    removeFAQ
} } = require('../services');

exports.addFAQ = async function (req, res) {

    const {
        title,
        content,
        contacts,
        link
    } = req.body;

    await addFAQ(title, content, contacts, link, result => {
        res.status(result.status).json({ message: result.message });
    }, err => {
        res.status(err.status).json({ message: err.message });
    });

};

exports.getFAQ = async function (req, res) {

    await getFAQ(result => {
        res.status(result.status).json(result.faq);
    }, err => {
        res.status(err.status).json({ message: err.message });
    });

};

exports.removeFAQ = async function (req, res) {
    const { _id } = req.body;

    await removeFAQ(_id, result => {
        res.status(result.status).json({ message: 'removed success' });
    }, err => {
        res.status(err.status).json({ message: err.message });
    });
};