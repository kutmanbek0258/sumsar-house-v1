const { checkToken: {
    checkToken
} } = require("./../helpers")
const { favoriteService: {
    addFavorite,
    clearFavorite,
    isFavorite,
    removeFavorite,
    getFavorites
}} = require("./../services")


exports.addFavorite = async function (req, res){

    if(await checkToken(req)){

        const user = req.body.user._id;
        const house = req.body.house._id;

        await isFavorite(user, house)

            .then(result => {

                if(result.favorite === false){

                    addFavorite(user, house)

                        .then(result => res.status(result.status).json({message: result.message}))

                        .catch(err => res.status(err.status).json({message: err.message}));

                }else{

                    removeFavorite(user, house)

                        .then(result => res.status(result.status).json({message: result.message}))

                        .catch(err => res.status(err.status).json({message: err.message}));
                }

            })

            .catch()

    }else{

        res.status(400).json({message: 'Invalid reguest !'})

    }



}

exports.getFavorites = async function (req, res) {

    if(await checkToken(req)){

        const user = req.body._id;

        await getFavorites(user)

            .then(result => res.status(result.status).json({favorites: result.favorites}))

            .catch(err => res.status(err.status).json({message: err.message}));

    }else{

        res.status(400).json({message: 'Invalid Request !'});

    }

}

exports.clearFavorite = async function (req, res) {

    if(await checkToken(req)){

        const user = req.body.user._id;

        await clearFavorite(user)

            .then(result => res.status(result.status).json({message: result.message}))

            .catch(err => res.status(err.status).json({message: err.message}));

    }else{

        res.status(400).json({message: 'Invalid Request !'});

    }


}