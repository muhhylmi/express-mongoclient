let dbconn

const Database = class Database {
    constructor(collection){
        this.collection = collection
    }
    static async injectDB(conn) {
        if (dbconn) {
            return
        }
        try {
            dbconn = await conn.db(process.env.DB_NAME)
            this.dbconn = dbconn
        } catch (e) {
            console.error(e)
        }
    }

    async aggregate(query) {
        let cursor;
        try {
            cursor = await dbconn.collection(this.collection).aggregate(query);
        } catch (error) {
            console.log(error);
            return []
        }
        return cursor;
    }

    async findOne(query, project = {}) {
        let cursor;
        try {
            cursor = await dbconn.collection(this.collection).findOne(query, project);
        } catch (error) {
            console.log(error);
            return [];
        }
        return cursor;
    }

    async find(query, project = {}) {
        let cursor;
        try {
            cursor = await dbconn.collection(this.collection).find(query, project);
        } catch (error) {
            console.log(error);
            return [];
        }
        return cursor;
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
            cursor = await dbconn.collection(this.collection).updateOne(query, set);
        } catch (error) {
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
            cursor = await dbconn.collection(this.collection).updateMany(query, set);
        } catch (error) {
            console.log(error);
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
            cursor = await dbconn.collection(this.collection).insertOne(query);
        } catch (error) {
            console.log(error);
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
            cursor = await dbconn.collection(this.collection).insertMany(query);
        } catch (error) {
            console.log(error);
            return;
        }
        return cursor;
    }

    async deleteOne(query) {
        let cursor;
        try {
            cursor = await dbconn.collection(this.collection).deleteOne(query);
        } catch (error) {
            console.log(error);
            return;
        }
        return cursor;
    }
}

module.exports = Database