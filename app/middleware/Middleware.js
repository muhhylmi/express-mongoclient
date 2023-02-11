const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const UserModel = require('../model/UserModel');


app.use((req, res, next) => {
    let route = req.method + ' ' + req.url;
    let checkRoute = checkRouteWithoutToken(route);
    let checkToken = checkAuthorization(req.headers.authorization, res);
    if (checkRoute) {
        return next();
    }
    if (checkToken) {
        return next();
    }
    res.status(404).json({ status: false, message: 'Unathorized' });
})

const checkRouteWithoutToken = (route) => {
    let routes = [
        'POST /api/user',
        'PUT /api/user',
        'DELETE /api/user',
        'POST /api/user/login'
    ]
    if (routes.includes(route)) {
        return true;
    }
    return false;
}

const checkAuthorization = function (token = null, res) {
    if (token === null) {
        return false;
    }
    let tokenArray = token.split(" ");
    try {
        let decode = jwt.verify(tokenArray[1], process.env.PRIVATE_KEY_JWT);
        let dataUser = (new UserModel).findOne({ 'username': decode.username });
        let result = true;
        dataUser.then(res => {
            if (res) {
                result = true;
            } else {
                result = false;
            }
        })
        return result;
    } catch (error) {
        res.status(404).json({ status: false, message: error.message });
    }
}

module.exports = app;