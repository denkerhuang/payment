"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger = require('../../livingmenu_lib/log-handler');
const ApiUtil = require('../../util/api-util');
// const ApiSauthQry = require('../api-sauth-qry')
function check(apiObj, checkArray) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('common check');
    });
}
exports.check = check;
function doAction(apiObj) {
    // const h = Logger.orgLogHeader(this.constructor.name, SessionGetallApi.name, 'doAction')
    //1. filter out session by Status === 'open'
    console.log('I am going to filter out sessions by Status === open');
    //2. filter out session by Status === 'open'
    console.log('if StartDate is given, I will filter it out also');
    console.log('StartDate ' + apiObj.req.query.StartDate);
    // [Test Only]
    return [{ 'SessionId': 'xxx1' }, { 'SessionId': 'xxx2' }];
}
exports.doAction = doAction;
function final() {
    // const h = Logger.orgLogHeader(this.constructor.name, SessionGetallApi.name, 'final')
}
exports.final = final;
//# sourceMappingURL=session-getall-common.js.map