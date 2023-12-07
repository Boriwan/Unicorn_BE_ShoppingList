const { TestHelper } = require("uu_appg01_server-test");

beforeAll(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "urn:uu:GGALL" });
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe("Testing the create uuCmd...", () => {
  test("HDS", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);

    let dtoIn = {
      name: "My archived shopping list",
      items: [
        { name: "orange", isChecked: false },
        { name: "strawberry", isChecked: false },
        { name: "corn", isChecked: false },
      ],
    };
    let result = await TestHelper.executePostCommand("shoppingList/create", dtoIn, session);

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });

  test("ALTS - unsupportedKeys", async () => {
    let session = await TestHelper.login("Authorities", false, false);

    let dtoIn = {
      name: "My archived shopping list",
      items: [
        { name: "orange", isChecked: false },
        { name: "strawberry", isChecked: false },
        { name: "corn", isChecked: false },
      ],
      extraAttribute: "test",
    };
    let result = await TestHelper.executePostCommand("shoppingList/create", dtoIn, session);

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
    let warning = result.data.uuAppErrorMap["uu-ukol-main/shoppingList/unsupportedKeys"];
    expect(warning).toBeDefined();
    expect(warning.type).toEqual("warning");
    expect(warning.message).toEqual("DtoIn contains unsupported keys.");
    expect(warning.paramMap).toEqual({ unsupportedKeyList: expect.arrayContaining(["$.extraAttribute"]) });
  });

  test("ALTS - invalidDtoIn", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);

    let dtoIn = { name: false };
    try {
      await TestHelper.executePostCommand("shoppingList/create", dtoIn, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.message).toBeDefined();
      expect(e.code).toEqual("uu-ukol-main/shoppingList/invalidDtoIn");
    }
  });
});
