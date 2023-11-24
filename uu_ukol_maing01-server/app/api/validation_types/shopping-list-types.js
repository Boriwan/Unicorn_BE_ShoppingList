/* eslint-disable */

const shoppingListsListDtoInType = shape({});

const shoppingListGetDtoInType = shape({
  id: id().isRequired(),
});

const shoppingListCreateDtoInType = shape({
  name: string().isRequired(),
  items: array(),
});
const shoppingListUpdateDtoInType = shape({
  id: id().isRequired(),
  name: string().isRequired(),
});

const shoppingListToggleArchiveDtoInType = shape({
  id: id().isRequired(),
});

const shoppingListDeleteDtoInType = shape({
  id: id().isRequired(),
});
