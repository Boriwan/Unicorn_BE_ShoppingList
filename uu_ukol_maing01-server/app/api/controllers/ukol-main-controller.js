"use strict";
const UkolMainAbl = require("../../abl/ukol-main-abl.js");

class UkolMainController {
  init(ucEnv) {
    return UkolMainAbl.init(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  load(ucEnv) {
    return UkolMainAbl.load(ucEnv.getUri(), ucEnv.getSession());
  }

  loadBasicData(ucEnv) {
    return UkolMainAbl.loadBasicData(ucEnv.getUri(), ucEnv.getSession());
  }
}

module.exports = new UkolMainController();
