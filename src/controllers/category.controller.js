'use strict';

const { categoryService: {
    addCategory,
    removeCategory,
    getCategories
} } = require('../services');

exports.addCategory = async function (req, res){

    const { name, description } = req.body;

    try{
        await addCategory(name, description);
    }catch (error){
        res.status(500).json({ error: true, message: 'Server error' });
        return;
    }

    res.status(200).json({ error: false, message: 'Created success' });
};

exports.getCategories = async function (req, res){

    let categories;

    try {
        categories = await getCategories();
    }catch (error){
        res.status(500).json({ error: true, message: 'Server error' });
        return;
    }

    res.status(200).json({ error: false, categories: categories });
};

exports.removeCategory = async function (req, res){

    const { _id } = req.body;

    try{
        await removeCategory(_id);
    }catch (error){
        res.status(500).json({ error: true, message: 'Server error' });
        return;
    }

    res.status(200).json({ error: false, message: 'Remove success' });
};

exports.removeCategory_v1 = async function (req, res){

    const { _id } = req.body;

    await removeCategory(_id)
        .then(() => res.status(200).json({ error: false, message: 'Remove success' }))
        .catch(() => res.status(500).json({ error: true, message: 'Server error' }));
};