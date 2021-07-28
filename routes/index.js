'use strict'

const bannerRoutes = require("./banner.routes")
const categoryRoutes = require("./category.routes")
const faqRoutes = require("./faq.routes")
const favoriteRoutes = require("./favorite.routes")
const historyRoutes = require("./history.routes")
const houseRoutes = require("./house.routes")
const userRoutes = require("./user.routes")
const viewRoutes = require("./view.routes")

let routes = app => {
    bannerRoutes(app)
    categoryRoutes(app)
    faqRoutes(app)
    favoriteRoutes(app)
    historyRoutes(app)
    houseRoutes(app)
    userRoutes(app)
    viewRoutes(app)
}

module.exports = routes