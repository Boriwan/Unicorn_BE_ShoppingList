const Constants = {
  Schemas: {
    UKOL_MAIN: "ukolMain",
    SHOPPING_LIST: "shoppingList",
    // TODO: Add other schemas when you configure one in persistance.json and create mongo file for it
  },

  ShoppingListStates: {
    CONSTRUCT: "construct",
    ACTIVE: "active",
    ARCHIVED: "archived",
    DELETED: "deleted",
  },
  Profiles: {
    AUTHORITIES: "Authorities",
    EXECUTIVES: "Executives",
    READERS: "Readers",
  },
};

//@@viewOn:exports
module.exports = Constants;
//@@viewOff:exports
