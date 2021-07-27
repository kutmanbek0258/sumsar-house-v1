const {categoryService: {
    addCategory,
    removeCategory,
    getCategories
}} = require("./../services")

exports.addCategory = async function (req, res){

    const name = req.body.name;
    const description = req.body.description;

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

    const _id = req.body._id;

    await removeCategory(_id, result => {
        res.status(result.status).json({message: result.message})
    }, err => {
        res.status(err.status).json({message: err.message})
    })
}