"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class ShoppingListMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, name: 1 });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async list(awid) {
    let filter = { awid };
    return await super.find(filter);
  }

  async get(awid, id) {
    return await super.findOne({ id, awid });
  }

  async delete(awid, id) {
    return await super.deleteOne({ id, awid });
  }
}

module.exports = ShoppingListMongo;
