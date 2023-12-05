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

describe("Testing the load uuCmd...", () => {
  test("HDS", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);

    let dtoIn = {};
    let result = await TestHelper.executeGetCommand("shoppingList/list", dtoIn, session);

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });

  test("ALTS - unsupportedKeys", async () => {
    let session = await TestHelper.login("Authorities", false, false);

    let dtoIn = { extraAttribute: "extra attribute" };
    let result = await TestHelper.executeGetCommand("shoppingList/list", dtoIn, session);

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
    let warning = result.data.uuAppErrorMap["uu-ukol-main/shoppingList/unsupportedKeys"];
    expect(warning).toBeDefined();
    expect(warning.type).toEqual("warning");
    expect(warning.message).toEqual("DtoIn contains unsupported keys.");
    expect(warning.paramMap).toEqual({ unsupportedKeyList: expect.arrayContaining(["$.extraAttribute"]) });
  });
});
