const response = require('../helper/response');
const UserModel = require("../model/user_model");
const userModel = new UserModel();
const validation = require('../validation/user_validation');

class UserController {
    async getAllUser (req, res) {
        const data = await userModel.getAllUser();
        return response.send(res, data);
    }

    async createUser (req, res) {
        const schema = validation.createUserSchema({ ...req.body });
        const { error } = schema.validate({ ...req.body});
        if(error){
            return response.error(res, error.message)
        }
        const data = await userModel.createUser(req.body);
        return res.send(data);
    }

    async getUserById (req, res) {
        const data = await userModel.findById(req.params.id);
        return res.send(data);
    }

    async updateUser (req, res) {
        const data = await userModel.updateUser(req.body);
    }

    async deleteOne (req, res) {
        const id = req.params.id;
        const data = await userModel.deletUser(id);
        return res.send(data)
    }

    async login (req, res) {
        const data = await userModel.login(req.body);
        res.send(data);
    }
}

module.exports = UserController;