/* eslint-disable */

const shoppingListsListDtoInType = shape({});
const shoppingListsListArchivedDtoInType = shape({});

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

const shoppingListAddItemDtoInType = shape({
  id: id().isRequired(),
  name: string().isRequired(),
});

const shoppingListCheckItemDtoInType = shape({
  id: id().isRequired(),
  name: string().isRequired(),
});

const shoppingListRemoveItemDtoInType = shape({
  id: id().isRequired(),
  name: string().isRequired(),
});

const shoppingListAddMemberDtoInType = shape({
  id: id().isRequired(),
  memberId: uuIdentity().isRequired(),
  memberName: string().isRequired(),
});

const shoppingListRemoveMemberDtoInType = shape({
  id: id().isRequired(),
  memberId: uuIdentity().isRequired(),
});
