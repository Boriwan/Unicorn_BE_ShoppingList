const { TestHelper } = require("uu_appg01_server-test");

beforeAll(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "urn:uu:GGALL" });
});

beforeEach(async () => {
  let session = await TestHelper.login("AwidLicenseOwner", false, false);

  let createDtoIn = {
    name: "My test shopping list",
    items: [
      {
        name: "apple",
        isChecked: "false",
      },
      {
        name: "banana",
        isChecked: "false",
      },
      {
        name: "milk",
        isChecked: "false",
      },
    ],
    awid: "22222222222222222222222222222222",
    owner: "822-5205-4105-0000",
    state: "active",
    members: [],
    sys: {
      cts: "2023-11-26T11:10:02.001Z",
      mts: "2023-11-26T11:10:02.001Z",
      rev: 0,
    },
  };
  let createResult = await TestHelper.executePostCommand("shoppingList/create", createDtoIn, session);
  createdShoppingListId = createResult.data.id;
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe("Testing the get uuCmd...", () => {
  test("HDS", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);

    let dtoIn = { id: createdShoppingListId };
    let result = await TestHelper.executeGetCommand("shoppingList/get", dtoIn, session);

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });

  test("ALTS - list does not exist", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);

    let dtoIn = { id: createdShoppingListId };
    let result = await TestHelper.executeGetCommand("shoppingList/get", dtoIn, session);

    // expect(result.status).toEqual(400);
    // expect(result.data.uuAppErrorMap).toBeDefined();
    // let warning = result.data.uuAppErrorMap["uu-ukol-main/shoppingList/shoppingListDoesNotExist"];
    // expect(warning).toBeDefined();
    // expect(warning.type).toEqual("warning");
    // expect(warning.message).toEqual("ShoppingList does not exist.");

    try {
      await result;
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.message).toBeDefined();
      expect(e.code).toEqual("uu-ukol-main/shoppingList/shoppingListDoesNotExist");
    }
  });

  test("ALTS - invalidDtoIn", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);

    let dtoIn = { id: "444" };
    try {
      await TestHelper.executeGetCommand("shoppingList/get", dtoIn, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.message).toBeDefined();
      expect(e.code).toEqual("uu-ukol-main/shoppingList/invalidDtoIn");
    }
  });
});
