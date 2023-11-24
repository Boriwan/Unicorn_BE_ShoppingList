"use strict";
const ShoppingListUseCaseError = require("./ukol-main-use-case-error.js");

const ShoppingList = {
  UC_CODE: `${ShoppingListUseCaseError.ERROR_PREFIX}shoppingList/`,

  InvalidDtoIn: class extends ShoppingListUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${ShoppingList.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  ShoppingListDoesNotExist: class extends ShoppingListUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}shoppingListDoesNotExist`;
      this.message = "ShoppingList does not exist.";
    }
  },
};

module.exports = {
  ShoppingList,
};
