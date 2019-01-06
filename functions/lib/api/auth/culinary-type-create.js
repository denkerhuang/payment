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
class PaymentCreateApi extends ApiAuthAlter {
    constructor(req, res) {
        super(req, res);
        this.name = 'PaymentCreateApi';
        // const h = Logger.orgLogHeader(this.name, 'constructor')
        req.apiUrl = '/payment';
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            // const h = Logger.orgLogHeader(this.name, 'execute')
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
            // const h = Logger.orgLogHeader(this.req.logPath, 'check')
            yield Promise.all(checkArray);
        });
    }
    doAction() {
        return __awaiter(this, void 0, void 0, function* () {
            const h = Logger.orgLogHeader(this.name, 'doAction');
            const Input = this.req.input;
            // Action 1: insert data into user collection
            yield FsUtil.addDataPlusChecking(LMCONST.Collection_Payment, this.req.input, (docId) => {
                this.output = { PaymentId: docId };
            });
            // [TEST Only] set uid = admin id after created
            this.req.description = '';
        });
    }
}
module.exports = PaymentCreateApi;
//# sourceMappingURL=payment-create.js.map