'use strict'

const {categoryService: {
    addCategory,
    removeCategory,
    getCategories
}} = require("../services")

exports.addCategory = async function (req, res){

    const { name, description } = req.body

    await addCategory(name, description, result => {
        res.status(result.status).json({message: result.message})
    }, err => {
        res.status(err.status).json({message: err.message})
    })
}

exports.getCategories = async function (req, res){

    await getCategories(result => {
        res.status(result.status).json({categories: result.categories})
    }, err => {
        res.status(err.status).json({message: err.message})
    })
}

exports.removeCategory = async function (req, res){

    const { _id } = req.body

    await removeCategory(_id, result => {
        res.status(result.status).json({message: result.message})
    }, err => {
        res.status(err.status).json({message: err.message})
    })
}