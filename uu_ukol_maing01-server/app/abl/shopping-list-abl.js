"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/shopping-list-error.js");
const { Schemas, Profiles } = require("../constants.js");
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ShoppingListStates } = require("../constants.js");

const WARNINGS = {
  shoppingListUnsupportedKeys: {
    code: `${Errors.ShoppingList.UC_CODE}unsupportedKeys`,
  },
};

class ShoppingListAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.SHOPPING_LIST);
  }

  async shoppingListsList(awid, dtoIn, authorizationResult) {
    // HDS 1
    let validationResult = this.validator.validate("shoppingListsListDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.shoppingListUnsupportedKeys.code,
      Errors.ShoppingList.InvalidDtoIn
    );

    let profiles = authorizationResult.getAuthorizedProfiles();

    let shoppingLists = await this.dao.list(awid);

    return {
      profiles,
      ...shoppingLists,
      uuAppErrorMap,
    };
  }
  async shoppingListGet(awid, dtoIn, authorizationResult) {
    // HDS 1
    let validationResult = this.validator.validate("shoppingListGetDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.shoppingListUnsupportedKeys.code,
      Errors.ShoppingList.InvalidDtoIn
    );

    let profiles = authorizationResult.getAuthorizedProfiles();

    let shoppingList = await this.dao.get(awid, dtoIn.id);

    if (!shoppingList) {
      throw new Errors.ShoppingList.ShoppingListDoesNotExist(uuAppErrorMap, { shoppingList: dtoIn.id });
    }

    return {
      profiles,
      ...shoppingList,
      uuAppErrorMap,
    };
  }

  async shoppingListCreate(awid, dtoIn, identity) {
    // HDS 1
    let validationResult = this.validator.validate("shoppingListCreateDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.shoppingListUnsupportedKeys.code,
      Errors.ShoppingList.InvalidDtoIn
    );

    dtoIn.awid = awid;
    dtoIn.owner = identity.getUuIdentity();
    dtoIn.state = ShoppingListStates.CONSTRUCT;
    dtoIn.members = [];

    let createdShoppingList = null;

    try {
      createdShoppingList = await this.dao.create(dtoIn);
    } catch (e) {
      // TODO: error report
      throw e;
    }
    return {
      ...createdShoppingList,
      uuAppErrorMap,
    };
  }
  async shoppingListDelete(awid, dtoIn, session, authorizationResult) {
    // HDS 1
    let validationResult = this.validator.validate("shoppingListDeleteDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.shoppingListUnsupportedKeys.code,
      Errors.ShoppingList.InvalidDtoIn
    );

    const shoppingList = await this.dao.get(awid, dtoIn.id);
    if (!shoppingList) {
      // 3.1
      throw new Errors.ShoppingList.ShoppingListDoesNotExist({ uuAppErrorMap }, { shoppingListId: dtoIn.id });
    }

    // hds 4
    const uuIdentity = session.getUuIdentity();
    const isAuthorities = authorizationResult.getAuthorizedProfiles().includes(Profiles.AUTHORITIES);
    if (uuIdentity !== shoppingList.uuIdentity && !isAuthorities) {
      // 4.1
      throw new Errors.ShoppingList.UserNotAuthorized({ uuAppErrorMap });
    }

    // hds 7
    await this.dao.delete(awid, dtoIn.id);

    // hds 8
    return { uuAppErrorMap };
  }
  // async shoppingListArchive(awid, dtoIn, identity) {
  //   // HDS 1
  //   let validationResult = this.validator.validate("shoppingListCreateDtoInType", dtoIn);
  //   // A1, A2
  //   let uuAppErrorMap = ValidationHelper.processValidationResult(
  //     dtoIn,
  //     validationResult,
  //     WARNINGS.shoppingListUnsupportedKeys.code,
  //     Errors.ShoppingList.InvalidDtoIn
  //   );

  //   dtoIn.awid = awid;
  //   dtoIn.owner = identity.getUuIdentity();
  //   dtoIn.state = ShoppingListStates.CONSTRUCT;
  //   dtoIn.members = [];

  //   let createdShoppingList = null;

  //   try {
  //     createdShoppingList = await this.dao.update(dtoIn);
  //   } catch (e) {
  //     // TODO: error report
  //     throw e;
  //   }
  //   return {
  //     ...createdShoppingList,
  //     uuAppErrorMap,
  //   };
  // }
}

module.exports = new ShoppingListAbl();
