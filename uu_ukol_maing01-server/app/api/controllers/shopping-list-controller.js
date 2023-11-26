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
  shoppingListsListArchived(ucEnv) {
    return shoppingListAbl.shoppingListsListArchived(
      ucEnv.getUri().getAwid(),
      ucEnv.getDtoIn(),
      ucEnv.getAuthorizationResult()
    );
  }
  shoppingListGet(ucEnv) {
    return shoppingListAbl.shoppingListGet(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getAuthorizationResult());
  }
  shoppingListCreate(ucEnv) {
    return shoppingListAbl.shoppingListCreate(
      ucEnv.getUri().getAwid(),
      ucEnv.getDtoIn(),
      ucEnv.getSession().getIdentity()
    );
  }
  shoppingListUpdate(ucEnv) {
    return shoppingListAbl.shoppingListUpdate(
      ucEnv.getUri().getAwid(),
      ucEnv.getDtoIn(),
      ucEnv.getSession().getIdentity(),
      ucEnv.getAuthorizationResult()
    );
  }
  shoppingListToggleArchive(ucEnv) {
    return shoppingListAbl.shoppingListToggleArchive(
      ucEnv.getUri().getAwid(),
      ucEnv.getDtoIn(),
      ucEnv.getSession().getIdentity(),
      ucEnv.getAuthorizationResult()
    );
  }
  shoppingListDelete(ucEnv) {
    return shoppingListAbl.shoppingListDelete(
      ucEnv.getUri().getAwid(),
      ucEnv.getDtoIn(),
      ucEnv.getSession().getIdentity(),
      ucEnv.getAuthorizationResult()
    );
  }

  shoppingListAddItem(ucEnv) {
    return shoppingListAbl.shoppingListAddItem(
      ucEnv.getUri().getAwid(),
      ucEnv.getDtoIn(),
      ucEnv.getSession().getIdentity(),
      ucEnv.getAuthorizationResult()
    );
  }

  shoppingListCheckItem(ucEnv) {
    return shoppingListAbl.shoppingListCheckItem(
      ucEnv.getUri().getAwid(),
      ucEnv.getDtoIn(),
      ucEnv.getSession().getIdentity(),
      ucEnv.getAuthorizationResult()
    );
  }

  shoppingListRemoveItem(ucEnv) {
    return shoppingListAbl.shoppingListRemoveItem(
      ucEnv.getUri().getAwid(),
      ucEnv.getDtoIn(),
      ucEnv.getSession().getIdentity(),
      ucEnv.getAuthorizationResult()
    );
  }
}

module.exports = new ShoppingListController();
