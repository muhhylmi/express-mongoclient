const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const DBHelper = require('../helper/database/database_helper');
const db = new DBHelper('user');


app.use( async (req, res, next) => {
    let route = req.method + ' ' + req.url;
    let checkRoute = checkRouteWithoutToken(route);
    let checkToken = await checkAuthorization(req.headers.authorization, res);
    if (checkRoute) {
        return next();
    }
    if (checkToken) {
        req.user = checkToken;
        return next();
    }
    res.status(404).json({ status: false, message: 'Unathorized' });
})

const checkRouteWithoutToken = (route) => {
    let routes = [
        'PUT /api/user',
        'DELETE /api/user',
        'POST /api/user/login'
    ]
    if (routes.includes(route)) {
        return true;
    }
    return false;
}

const checkAuthorization = async function (token = null, res) {
    if (token === null) {
        return false;
    }
    let tokenArray = token.split(" ");
    try {
        let result = '';
        let decode = jwt.verify(tokenArray[1], process.env.PRIVATE_KEY_JWT);
        let dataUser = await db.findOne({ 'username': decode.username });
        if(dataUser){
            return dataUser
        }
        return result;
    } catch (error) {
        res.status(404).json({ status: false, message: error.message });
    }
}

module.exports = app;