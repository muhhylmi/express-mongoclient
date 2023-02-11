const logger = require('../logger');
const connection = require('./connection');

class Database {
    constructor(collection){
        this.collection = collection
    }

    async aggregate(query) {
        const ctx = 'Database-aggregate'
        let cursor;
        try {
            const db = await connection.getConnection();
            cursor = await db.collection(this.collection).aggregate(query);
        } catch (error) {
            logger.error(ctx, error.message, 'aggregate');
            return []
        }
        return cursor;
    }

    async findOne(query, project = {}) {
        let cursor;
        try {
            const db = await connection.getConnection();
            cursor = await db.collection(this.collection).findOne(query, project);
        } catch (error) {
            logger.error('DatabaseHelper-findOne', error.message);
            return [];
        }
        return cursor;
    }

    async find(query, project = {}) {
        let cursor;
        try {
            const db = await connection.getConnection();
            cursor = db.collection(this.collection).find(query, project);
        } catch (error) {
            logger.error('DatabaseHelper-find', error.message);
            return [];
        }
        return cursor.toArray();
    }

    /**
     * 
     * @param object query 
     * @param object set 
     * @returns 
     */
    async updateOne(query, set) {
        let cursor;
        try {
            cursor = await this.db.collection(this.collection).updateOne(query, set);
        } catch (error) {
            logger.error('DatabaseHelper-updateOne', error.message);
            return error.message;
        }
        return cursor;
    }

    /**
     * 
     * @param object query 
     * @param array set 
     * @returns 
     */
    async updateMany(query, set) {
        let cursor;
        try {
            cursor = await this.db.collection(this.collection).updateMany(query, set);
        } catch (error) {
            logger.error('DatabaseHelper-updateMany', error.message);
            return [];
        }
        return cursor;
    }

    /**
     * 
     * @param object query 
     * @returns 
     */
    async insertOne(query) {
        let cursor;
        try {
            cursor = await this.db.collection(this.collection).insertOne(query);
        } catch (error) {
            logger.error('DatabaseHelper-insertOne', error.message);
            return;
        }
        return cursor;
    }

    /**
     * 
     * @param array query 
     * @returns 
     */
    async insertMany(query) {
        let cursor;
        try {
            cursor = await this.db.collection(this.collection).insertMany(query);
        } catch (error) {
            logger.error('DatabaseHelper-insertMany', error.message);
            return;
        }
        return cursor;
    }

    async deleteOne(query) {
        let cursor;
        try {
            cursor = await this.db.collection(this.collection).deleteOne(query);
        } catch (error) {
            logger.error('DatabaseHelper-deleteOne', error.message);
            return;
        }
        return cursor;
    }
}

module.exports = Database