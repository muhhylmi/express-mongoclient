const { ObjectId } = require('bson');
const DBHelper = require('../helper/database/database_helper');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const logger = require('../helper/logger');
const db = new DBHelper('user');

class UserModel {

  constructor() {
    this.db = db;
    this.UPDATE = 'update';
    this.ARCHIVE = 'archive';
  }

  async getAllUser() {
    try {
      let data = await db.find();
      data = data.map(value => {
        delete value.password;
        return value;
      });
      return this.response(true, data, []);
    } catch (error) {
      return this.response(false, [], [error.message]);
    }
  }

  async createUser(request) {
    const query = {
      $or: [
        { username: request.username },
        { email: request.email }
      ]
    };
    const check_username = await (await db.findOne(query));
    if (check_username) {
      return this.response(false, {}, ['username already exists']);
    }
    const hash = bcrypt.hashSync(request.password, 5);
    request.password = hash;
    let data = await (await db.insertOne(request));
    if (data.acknowledged) {
      return this.response(true, data, ['success add data']);
    }
    return this.response(false, {}, ['create user failed']);

  }

  async findById(id) {
    try {
      let data = await (await db.findOne({ '_id': new ObjectId(id) }));
      if (data) {
        delete data.password;
        return this.response(true, data, []);
      }
      return this.response(true, [], []);
    } catch (error) {
      return this.response(false, [], [error.message]);
    }
  }


  async updateUser(request) {
    try {
      let new_data = request.set;
      new_data.password = bcrypt.hashSync(new_data.password, 5);
      let query = { '_id': new ObjectId(new_data._id) };
      const check_username = await (await this.findOne({
        '_id': { '$ne': new ObjectId(new_data._id) },
        'username': new_data.username,
      }));
      if (check_username) {
        return this.response(false, {}, ['username already exists']);
      }
      delete new_data._id;
      if (request.action == this.UPDATE) {
        let update = await (await db.updateOne(query, { '$set': new_data }));
        if (update.acknowledged) {
          return this.response(true, update, []);
        }
        return this.response(false, [], ['data not updated']);
      } else if (request.action == this.ARCHIVE) {
        let update = await (await db.updateOne(query, { '$set': { 'isArchive': true } }));
        if (update) {
          return this.response(true, update, []);
        }
        return this.response(false, [], ['data not updated']);
      }
    } catch (error) {
      return this.response(false, [], [error.message]);
    }
  }


  async deletUser(id) {
    const ctx = 'Usermodel-deleteUser';
    let query = { '_id': new ObjectId(id) };
    try {
      let data = await (await db.deleteOne(query));
      if (data) {
        return this.response(true, data, []);
      }
      return this.response(true, [], []);
    } catch (error) {
      logger.error(ctx, 'Failed to delete user');
      return this.response(false, [], [error.message]);
    }
  }

  async login(request) {
    const ctx = 'UserModel-login';
    try {
      let data = await db.findOne({
        'username': request.username
      });
      if (data) {
        let check_password = bcrypt.compareSync(request.password, data.password);
        if (check_password) {
          delete data.password;
          data._id = data._id.toString();
          data.token = jwt.sign(data, config.get('/privateKeyJwt'), { expiresIn: '1d' });
          return this.response(true, data, []);
        }
      }
      return this.response(true, [], ['invalid credentials']);
    } catch (error) {
      logger.error(ctx, 'Failed to login');
      return this.response(false, [], [error.message]);
    }
  }

  response(success, data, message) {
    return { success, data, message };
  }
}

module.exports = UserModel;
