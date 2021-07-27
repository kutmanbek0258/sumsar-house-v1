const config = require("./../config/config.json")

const { bannerService: {
    addBanner,
    getBanners,
    removeBanner
} } = require("./../services")

exports.addBanner = async function (req, res) {
    const description = req.body.description;
    const link = req.body.link;
    const location = req.body.location;

    await addBanner(description, link, location, result => {
        res.status(result.status).json({ message: result.message })
    }, err => {
        res.status(err.status).json({ message: err.message })
    })

}

exports.getBanners = async function (req, res) {

    const location = req.body;
    const limit = config.banner_limit;
    const radius = config.banner_radius;

    await getBanners(limit, location, radius, result => {
        res.status(result.status).json({banners: result.banners})
    }, err => {
        res.status(err.status).json({message: err.message})
    })

}

exports.removeBanner = async function (req, res) {
    const { _id } = req.body;

    await removeBanner(_id, result => {
        res.status(result.status).json({message: "removed success"})
    }, err => {
        res.status(err.status).json({message: err.message})
    })
}