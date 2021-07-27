const {
    categoryService:
        {
            addCategory,
            removeCategory,
            getCategories
        }
    } = require("./../services")

exports.addCategory = async function (req, res){

    const name = req.body.name;
    const description = req.body.description;

    addCategory(name, description)

        .then(result => res.status(result.status).json({message: result.message}))

        .catch(err => res.status(err.status).json({message: err.message}));
}

exports.getCategories = async function (req, res){

    getCategories()

        .then(result => res.status(result.status).json({categories: result.categories}))

        .catch(err => res.status(err.status).json({message: err.message}));
}

exports.removeCategory = async function (req, res){

    const _id = req.body._id;

    removeCategory(_id)

        .then(result => res.status(result.status).json({message: result.message}))

        .catch(err => res.status(err.status).json({message: err.message}));
}