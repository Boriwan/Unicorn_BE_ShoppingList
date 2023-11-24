"use strict";

const shoppingListAbl = require("../../abl/shopping-list-abl");

class ShoppingListController {
  shoppingListsList(ucEnv) {
    return shoppingListAbl.shoppingListsList(
      ucEnv.getUri().getAwid(),
      ucEnv.getDtoIn(),
      ucEnv.getAuthorizationResult()
    );
  }
  shoppingListGet(ucEnv) {
    return shoppingListAbl.shoppingListGet(
      ucEnv.getUri().getAwid(),
      ucEnv.getDtoIn(),
      ucEnv.getAuthorizationResult()
    );
  }
  shoppingListCreate(ucEnv) {
    return shoppingListAbl.shoppingListCreate(
      ucEnv.getUri().getAwid(),
      ucEnv.getDtoIn(),
      ucEnv.getSession().getIdentity()
    );
  }
}

module.exports = new ShoppingListController();
