"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Logger = require('../../livingmenu_lib/log-handler');
const ApiAuthAlter = require('../api-auth-alter');
const ApiUtil = require('../../util/api-util');
const LMCONST = require('../../Constant');
const FsUtil = require('../../util/firestore-util');
class LocationCreateApi extends ApiAuthAlter {
    constructor(req, res) {
        super(req, res);
        this.name = 'LocationCreateApi';
        req.apiUrl = '/location';
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.check([]);
                yield this.doAction();
                yield this.final();
            }
            catch (error) {
                ApiUtil.sendError(error, this.res);
            }
        });
    }
    check(checkArray) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            _super("check").call(this, checkArray);
            this.req.logPath = this.name;
            yield Promise.all(checkArray);
        });
    }
    doAction() {
        return __awaiter(this, void 0, void 0, function* () {
            const h = Logger.orgLogHeader(this.name, 'doAction');
            // Action 1: insert data into location collection
            yield FsUtil.addDataPlusChecking(LMCONST.Collection_Location, this.req.input, (docId) => {
                this.output = { LocationId: docId };
                this.req.description = `create location ${docId} success`;
            });
            this.req.uid = 'test'; // [TEST Only] [TODO] set uid = operatorId after created
        });
    }
}
module.exports = LocationCreateApi;
//# sourceMappingURL=location-create.js.map