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

    let state = ShoppingListStates.ACTIVE;

    let shoppingLists = await this.dao.list(awid, state);

    return {
      profiles,
      ...shoppingLists,
      uuAppErrorMap,
    };
  }

  async shoppingListsListArchived(awid, dtoIn, authorizationResult) {
    // HDS 1
    let validationResult = this.validator.validate("shoppingListsListArchivedDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.shoppingListUnsupportedKeys.code,
      Errors.ShoppingList.InvalidDtoIn
    );

    let profiles = authorizationResult.getAuthorizedProfiles();

    let state = ShoppingListStates.ARCHIVED;

    let shoppingLists = await this.dao.listArchived(awid, state);

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
    dtoIn.state = ShoppingListStates.ACTIVE;
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

  async shoppingListUpdate(awid, dtoIn, session, authorizationResult) {
    // HDS 1
    let validationResult = this.validator.validate("shoppingListUpdateDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.shoppingListUnsupportedKeys.code,
      Errors.ShoppingList.InvalidDtoIn
    );

    const shoppingList = await this.dao.get(awid, dtoIn.id);
    if (!shoppingList) {
      throw new Errors.ShoppingList.ShoppingListDoesNotExist({ uuAppErrorMap }, { shoppingListId: dtoIn.id });
    }

    const uuIdentity = session.getUuIdentity();
    const isAuthorities = authorizationResult.getAuthorizedProfiles().includes(Profiles.AUTHORITIES);
    if (uuIdentity !== shoppingList.uuIdentity && !isAuthorities) {
      throw new Errors.ShoppingList.UserNotAuthorized({ uuAppErrorMap });
    }

    const isEmptyText = "text" in dtoIn && dtoIn.text.trim().length === 0;

    if (isEmptyText) {
      throw new Errors.ShoppingList.TextCannotBeRemoved(uuAppErrorMap, { text: dtoIn.text });
    }
    const toUpdate = { ...dtoIn };

    toUpdate.awid = awid;

    let updatedShoppingList;
    try {
      updatedShoppingList = await this.dao.update(toUpdate);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.ShoppingList.ShoppingListDaoUpdateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    return {
      ...updatedShoppingList,
      uuAppErrorMap,
    };
  }

  async shoppingListToggleArchive(awid, dtoIn, session, authorizationResult) {
    // HDS 1
    let validationResult = this.validator.validate("shoppingListToggleArchiveDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.shoppingListUnsupportedKeys.code,
      Errors.ShoppingList.InvalidDtoIn
    );

    const shoppingList = await this.dao.get(awid, dtoIn.id);
    if (!shoppingList) {
      throw new Errors.ShoppingList.ShoppingListDoesNotExist({ uuAppErrorMap }, { shoppingListId: dtoIn.id });
    }

    const uuIdentity = session.getUuIdentity();
    const isAuthorities = authorizationResult.getAuthorizedProfiles().includes(Profiles.AUTHORITIES);
    if (uuIdentity !== shoppingList.uuIdentity && !isAuthorities) {
      throw new Errors.ShoppingList.UserNotAuthorized({ uuAppErrorMap });
    }

    if (shoppingList.state === ShoppingListStates.ACTIVE || shoppingList.state === ShoppingListStates.CONSTRUCT) {
      shoppingList.state = ShoppingListStates.ARCHIVED;
    } else if (shoppingList.state === ShoppingListStates.ARCHIVED) {
      shoppingList.state = ShoppingListStates.ACTIVE;
    }

    await this.dao.update(shoppingList);
    const successMessage = "Successfully archived shopping list " + shoppingList.id;

    return { successMessage, ...shoppingList, uuAppErrorMap };
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
      throw new Errors.ShoppingList.ShoppingListDoesNotExist({ uuAppErrorMap }, { shoppingListId: dtoIn.id });
    }

    const uuIdentity = session.getUuIdentity();
    const isAuthorities = authorizationResult.getAuthorizedProfiles().includes(Profiles.AUTHORITIES);
    if (uuIdentity !== shoppingList.uuIdentity && !isAuthorities) {
      throw new Errors.ShoppingList.UserNotAuthorized({ uuAppErrorMap });
    }

    await this.dao.delete(awid, dtoIn.id);
    const successMessage = "Successfully deleted shopping list " + shoppingList.id;

    return { successMessage, uuAppErrorMap };
  }

  async shoppingListAddItem(awid, dtoIn, session, authorizationResult) {
    // HDS 1
    let validationResult = this.validator.validate("shoppingListAddItemDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.shoppingListUnsupportedKeys.code,
      Errors.ShoppingList.InvalidDtoIn
    );

    let shoppingList = await this.dao.get(awid, dtoIn.id);
    if (!shoppingList) {
      throw new Errors.ShoppingList.ShoppingListDoesNotExist({ uuAppErrorMap }, { shoppingListId: dtoIn.id });
    }

    const uuIdentity = session.getUuIdentity();
    const isAuthorities = authorizationResult.getAuthorizedProfiles().includes(Profiles.AUTHORITIES);
    if (uuIdentity !== shoppingList.uuIdentity && !isAuthorities) {
      throw new Errors.ShoppingList.UserNotAuthorized({ uuAppErrorMap });
    }

    let newItem = { name: dtoIn.name, isChecked: false };

    if (!shoppingList.items || !Array.isArray(shoppingList.items)) {
      shoppingList.items = [];
    }

    let currentList = shoppingList.items;

    console.log(currentList);
    currentList.push(newItem);

    shoppingList.items = currentList;

    await this.dao.update(shoppingList);
    const successMessage = "Successfully added new item " + newItem.name + " to the shopping list " + shoppingList.id;

    return { successMessage, ...shoppingList, uuAppErrorMap };
  }

  async shoppingListCheckItem(awid, dtoIn, session, authorizationResult) {
    // HDS 1
    let validationResult = this.validator.validate("shoppingListCheckItemDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.shoppingListUnsupportedKeys.code,
      Errors.ShoppingList.InvalidDtoIn
    );

    const shoppingList = await this.dao.get(awid, dtoIn.id);
    if (!shoppingList) {
      throw new Errors.ShoppingList.ShoppingListDoesNotExist({ uuAppErrorMap }, { shoppingListId: dtoIn.id });
    }

    const uuIdentity = session.getUuIdentity();
    const isAuthorities = authorizationResult.getAuthorizedProfiles().includes(Profiles.AUTHORITIES);
    if (uuIdentity !== shoppingList.uuIdentity && !isAuthorities) {
      throw new Errors.ShoppingList.UserNotAuthorized({ uuAppErrorMap });
    }

    let dtoInItemName = dtoIn.name;

    const targetItem = shoppingList.items.find((item) => item.name === dtoInItemName);

    if (targetItem) {
      targetItem.isChecked = !targetItem.isChecked;
    } else {
      throw new Errors.ShoppingList.ItemNotFound({ uuAppErrorMap }, { itemName: dtoInItemName });
    }

    await this.dao.update(shoppingList);

    const successMessage = `Successfully toggled isChecked state for item ${dtoInItemName} in shopping list ${shoppingList.id}`;

    return { successMessage, ...shoppingList, uuAppErrorMap };
  }

  async shoppingListRemoveItem(awid, dtoIn, session, authorizationResult) {
    // HDS 1
    let validationResult = this.validator.validate("shoppingListRemoveItemDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.shoppingListUnsupportedKeys.code,
      Errors.ShoppingList.InvalidDtoIn
    );

    const shoppingList = await this.dao.get(awid, dtoIn.id);
    if (!shoppingList) {
      throw new Errors.ShoppingList.ShoppingListDoesNotExist({ uuAppErrorMap }, { shoppingListId: dtoIn.id });
    }

    const uuIdentity = session.getUuIdentity();
    const isAuthorities = authorizationResult.getAuthorizedProfiles().includes(Profiles.AUTHORITIES);
    if (uuIdentity !== shoppingList.uuIdentity && !isAuthorities) {
      throw new Errors.ShoppingList.UserNotAuthorized({ uuAppErrorMap });
    }

    let dtoInItemName = dtoIn.name;

    const targetItemIndex = shoppingList.items.findIndex((item) => item.name === dtoInItemName);

    if (targetItemIndex !== -1) {
      shoppingList.items.splice(targetItemIndex, 1);
      await this.dao.update(shoppingList);
    } else {
      throw new Errors.ShoppingList.ItemNotFound({ uuAppErrorMap }, { itemName: dtoInItemName });
    }

    const successMessage = `Successfully removed item ${dtoInItemName} in shopping list ${shoppingList.id}`;

    return { successMessage, ...shoppingList, uuAppErrorMap };
  }

  async shoppingListAddMember(awid, dtoIn, session, authorizationResult) {
    // HDS 1
    let validationResult = this.validator.validate("shoppingListAddMemberDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.shoppingListUnsupportedKeys.code,
      Errors.ShoppingList.InvalidDtoIn
    );

    let shoppingList = await this.dao.get(awid, dtoIn.id);
    if (!shoppingList) {
      throw new Errors.ShoppingList.ShoppingListDoesNotExist({ uuAppErrorMap }, { shoppingListId: dtoIn.id });
    }

    const uuIdentity = session.getUuIdentity();
    const isAuthorities = authorizationResult.getAuthorizedProfiles().includes(Profiles.AUTHORITIES);
    if (uuIdentity !== shoppingList.uuIdentity && !isAuthorities) {
      throw new Errors.ShoppingList.UserNotAuthorized({ uuAppErrorMap });
    }

    let newMember = { id: dtoIn.memberId, name: dtoIn.memberName };

    if (!shoppingList.members || !Array.isArray(shoppingList.members)) {
      shoppingList.members = [];
    }

    let currentList = shoppingList.members;

    console.log(currentList);
    currentList.push(newMember);

    shoppingList.members = currentList;

    await this.dao.update(shoppingList);
    const successMessage =
      "Successfully added new member " + newMember.name + " to the shopping list " + shoppingList.id;

    return { successMessage, ...shoppingList, uuAppErrorMap };
  }

  async shoppingListRemoveMember(awid, dtoIn, session, authorizationResult) {
    // HDS 1
    let validationResult = this.validator.validate("shoppingListRemoveMemberDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.shoppingListUnsupportedKeys.code,
      Errors.ShoppingList.InvalidDtoIn
    );

    const shoppingList = await this.dao.get(awid, dtoIn.id);
    if (!shoppingList) {
      throw new Errors.ShoppingList.ShoppingListDoesNotExist({ uuAppErrorMap }, { shoppingListId: dtoIn.id });
    }

    const uuIdentity = session.getUuIdentity();
    const isAuthorities = authorizationResult.getAuthorizedProfiles().includes(Profiles.AUTHORITIES);
    if (uuIdentity !== shoppingList.uuIdentity && !isAuthorities) {
      throw new Errors.ShoppingList.UserNotAuthorized({ uuAppErrorMap });
    }

    let dtoInMember = dtoIn.memberId;

    const targetMemberIndex = shoppingList.members.findIndex((member) => member.id === dtoInMember);

    if (targetMemberIndex !== -1) {
      shoppingList.members.splice(targetMemberIndex, 1);
      await this.dao.update(shoppingList);
    } else {
      throw new Errors.ShoppingList.MemberNotFound({ uuAppErrorMap }, { memberId: dtoInMember });
    }

    const successMessage = `Successfully removed member ${dtoInMember} in shopping list ${shoppingList.id}`;

    return { successMessage, ...shoppingList, uuAppErrorMap };
  }
}

module.exports = new ShoppingListAbl();
