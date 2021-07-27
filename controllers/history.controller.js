
const { checkToken: {
    checkToken
} } = require("./../helpers")
const { historyService: {
    addHistory,
    clearHistory,
    isHistory,
    getHistories,
    removeHistory
} } = require("./../services")

exports.addHistory = async function (req, res) {

    if(await checkToken(req)){

        const user = req.body.user._id;
        const house = req.body.house._id;

        await isHistory(user, house)

            .then(result => {
                if(result.history === false){

                    addHistory(user,house)

                        .then(result => res.status(result.status).json({message: result.message}))

                        .catch(err => res.status(err.status).json({message: err.message}));

                } else{

                    res.status(result.status).json({message: 'Already in history'});

                }
            })

            .catch(err => res.status(err.status).json({message: err.message}));

    }else{

        res.status(400).json({message: 'Invalid request !'})

    }

}

exports.historyList = async function (req, res) {

    if(await checkToken(req)){

        const user = req.body._id;

        await getHistories(user)

            .then(result => res.status(result.status).json({histories: result.histories}))

            .catch(err => res.status(err.status).json({message: err.message}));

    }else{

        res.status(400).json({message: 'Invalid reguest !'})

    }

}

exports.historyClear = async function (req, res) {

    if(await checkToken(req)){

        const user = req.body.user._id;

        await clearHistory(user)

            .then(result => res.status(result.status).json({message: result.message}))

            .catch(err => res.status(err.status).json({message: err.message}));

    }else{

        res.status(400).json({message: 'Invalid request !'})

    }

}

exports.historyRemove = async function (req, res) {

    if(await checkToken(req)){

        const user = req.body.user._id;
        const house = req.body.house._id;

        await removeHistory(user, house)

            .then(result => res.status(result.status).json({message: result.message}))

            .catch(err => res.status(err.status).json({message: err.message}));

    }else{

        res.status(400).json({message: 'Invalid reguest !'})

    }

}