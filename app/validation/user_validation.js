const joi = require('joi');

const createUserSchema = (payload) => {
    return joi.object({
        username: joi.string().alphanum().min(3).max(50).required(),
        password: joi.string().min(7).required(),
        createdAt: joi.string().forbidden().default(new Date().toISOString()),
        createdBy: joi.string().forbidden().default('superadmin')
    })
}

module.exports = {
    createUserSchema
}