/* eslint-disable */

const shoppingListsListDtoInType = shape({});

const shoppingListGetDtoInType = shape({
  id: id().isRequired(),
});

const shoppingListCreateDtoInType = shape({
  name: string().isRequired(),
  items: array(),
});
