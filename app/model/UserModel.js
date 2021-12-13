const BaseDao = require("../helper/BaseDao");
const bcrypt = require("bcrypt");
const { ObjectId } = require("bson");


const UserModel = class UserModel extends BaseDao {
    collection = 'user';
    UPDATE = 'update';
    ARCHIVE = 'archive';


    async getAllUser() {
        try {
            let data = await (await this.find()).toArray();
            return this.response(true, data, []);
        } catch (error) {
            return this.response(false, [], [error.message])
        }
    }

    async createUser(request) {
        try {
            const check_username = await (await this.findOne({ 'username': request.username }));
            if (check_username) {
                return this.response(false, {}, ['username already exists']);
            }
            const hash = bcrypt.hashSync(request.password, 5);
            request.password = hash;
            let data = await (await this.insertOne(request));
            console.log(data);
            if (data.acknowledged) {
                return this.response(true, data, ['success add data'])
            } else {
                return this.response(false, {}, ['create user failed'])
            }
        } catch (err) {
            return this.response(false, {}, [err.message])
        }
    }

    async findById(id) {
        try {
            let data = await (await this.findOne({ '_id': new ObjectId(id) }))
            if (data) {
                delete data.password;
                return this.response(true, data, []);
            }
            return this.response(true, [], []);
        } catch (error) {
            return this.response(false, [], [error.message])
        }
    }


    async updateUser(request) {
        try {
            let new_data = request.set;
            new_data.password = bcrypt.hashSync(new_data.password, 5)
            let query = { '_id': new ObjectId(new_data._id) }
            const check_username = await (await this.findOne({
                '_id': { '$ne': new ObjectId(new_data._id) },
                'username': new_data.username,
            }));
            if (check_username) {
                return this.response(false, {}, ['username already exists']);
            }
            delete new_data._id;
            if (request.action == this.UPDATE) {
                let update = await (await this.updateOne(query, { '$set': new_data }));
                if (update.acknowledged) {
                    return this.response(true, update, []);
                }
                return this.response(false, [], ['data not updated'])
            } else if (request.action == this.ARCHIVE) {
                let update = await (await this.updateOne(query, { '$set': { 'isArchive': true } }));
                if (update) {
                    return this.response(true, update, []);
                }
                return this.response(false, [], ['data not updated'])
            }
        } catch (error) {
            return this.response(false, [], [err.message]);
        }
    }


    async deletUser(id) {
        let query = { '_id': new ObjectId(id) };
        try {
            let data = await (await this.deleteOne(query))
            if (data) {
                return this.response(true, data, []);
            }
            return this.response(true, [], []);
        } catch (error) {
            return this.response(false, [], [err.message]);
        }
    }

    response(success, data, message) {
        return { success: success, data: data, message: message }
    }
}

module.exports = UserModel;