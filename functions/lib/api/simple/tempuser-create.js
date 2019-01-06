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
const ApiSauthAlter = require('../api-sauth-alter');
const ApiUtil = require('../../util/api-util');
const FsUtil = require('../../util/firestore-util');
const LMCONST = require('../../Constant');
class TempuserCreateApi extends ApiSauthAlter {
    constructor(req, res) {
        // req.apiname = TempuserCreateApi.name
        super(req, res);
        const h = Logger.orgLogHeader(TempuserCreateApi.name, 'constructor');
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const h = Logger.orgLogHeader(TempuserCreateApi.name, 'execute');
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
            const h = Logger.orgLogHeader(TempuserCreateApi.name, 'check');
            // check 1: if email, phone and credit card number, all of them already exists
            yield Promise.all(checkArray);
        });
    }
    doAction() {
        return __awaiter(this, void 0, void 0, function* () {
            // Logger.setFunctionName('doAction')
            const h = Logger.orgLogHeader(TempuserCreateApi.name, 'doAction');
            // action 1: insert data into tempuser collection
            // [TEST Only] data needs to be corrected
            yield FsUtil.addDataPlusChecking(LMCONST.Collection_Tempuser, { "Email": "a4", "Phone": "b", "CardNumber": "c" }, (docId) => {
                console.log(docId);
                this.output = { TempuserId: docId };
            });
            // [TEST Only] set uid = temp user id after created
            this.req.uid = 'D3VFHZb38LWypEN9g7Gz';
            this.req.description = 'This is operated by temp user';
        });
    }
    final() {
        super.final();
        const h = Logger.orgLogHeader(TempuserCreateApi.name, 'final');
        // this.res.send({
        // 	UserId: 'D3VFHZb38LWypEN9g7Gz'
        // })
    }
}
module.exports = TempuserCreateApi;
//# sourceMappingURL=tempuser-create.js.map