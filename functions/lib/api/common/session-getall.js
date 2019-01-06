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
const FsUtil = require('../../util/firestore-util');
const LMCONST = require('../../Constant');
function execute(apiObj) {
    return __awaiter(this, void 0, void 0, function* () {
        const h = Logger.orgLogHeader('SessionGetallApi', 'execute');
        try {
            yield check(apiObj, []);
            yield doAction(apiObj);
            yield final(apiObj);
        }
        catch (error) {
            ApiUtil.sendError(error, apiObj.res);
        }
    });
}
exports.execute = execute;
function check(apiObj, checkArray) {
    return __awaiter(this, void 0, void 0, function* () {
        apiObj.check(checkArray);
        yield Promise.all(checkArray);
    });
}
function doAction(apiObj) {
    return __awaiter(this, void 0, void 0, function* () {
        const h = Logger.orgLogHeader('SessionGetallApi', 'doAction');
        let returnArray = [];
        //Action 1: filter out session by Status === 'open'
        yield FsUtil.getMulDataSimple(LMCONST.Collection_Session, 'Status', '==', LMCONST.SessionStatus_Open, (documents) => {
            documents.forEach(document => {
                FsUtil.convertFSDocToJSObj(LMCONST.Collection_Session, document, sessionJson => {
                    returnArray.push(sessionJson);
                });
            });
        });
        //[Future] filter out session by startDate
        //get from apiObj.req.query.StartDate
        apiObj.output = returnArray;
    });
}
function final(apiObj) {
    apiObj.final();
    const h = Logger.orgLogHeader('SessionGetallApi', 'final');
}
//# sourceMappingURL=session-getall.js.map