'use strict'

const bannerRoutes = require("./banner.routes")
const categoryRoutes = require("./category.routes")
const faqRoutes = require("./faq.routes")
const favoriteRoutes = require("./favorite.routes")
const historyRoutes = require("./history.routes")
const houseRoutes = require("./house.routes")
const userRoutes = require("./house.routes")

let routes = app => {
    bannerRoutes(app)
    categoryRoutes(app)
    faqRoutes(app)
    favoriteRoutes(app)
    historyRoutes(app)
    houseRoutes(app)
    userRoutes(app)
}

module.exports = routes