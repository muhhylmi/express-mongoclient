const express = require("express");
const UserController = require("../controller/user_controller");
const route = express.Router();

const User = new UserController();
route.post('/user/login', User.login);
route.get('/user', User.getAllUser);
route.post('/user', User.createUser);
route.get('/user/:id', User.getUserById);
route.put('/user', User.updateUser);
route.delete('/user/:id', User.deleteOne);

module.exports = route;