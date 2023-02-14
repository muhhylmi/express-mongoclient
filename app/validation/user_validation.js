const joi = require('joi');
const uuid = require('uuid').v4;

const createUserSchema = (payload) => {
    const userId = payload.userData.userId || '';
    return joi.object({
        username: joi.string().alphanum().min(3).max(50).required(),
        email: joi.string().email().required(),
        password: joi.string().min(7).required(),
        address: joi.object({
            city: joi.string().required(),
            state: joi.string().max(2).min(2).required()
        }),
        userId: joi.string().guid().forbidden().default(uuid()),
        createdAt: joi.string().forbidden().default(new Date().toISOString()),
        createdBy: joi.string().forbidden().default(userId)
    })
}

module.exports = {
    createUserSchema
}