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
            // Action 1: insert payable data into payment collection
            const payable = this.req.input;
            payable.Status = 'pending';
            yield FsUtil.addDataPlusChecking(LMCONST.Collection_Payment, payable, (docId) => {
                this.output = { PaymentId: docId };
            });
            // Action 2: insert receivable data into payment collection
            // const receivable = {
            //     Payer: payable.Receiver,
            //     Receiver: payable.Payer,
            //     Amount: -payable.Amount,
            // };
            // delete payable.Receiver
            // delete payable.Payer
            // delete payable.Amount
            // Object.keys(payable).forEach(key => {
            //     receivable[key] = payable[key]
            // })
            // await FsUtil.addDataPlusChecking(LMCONST.Collection_Payment, receivable, (docId) => {
            //     this.output = { PaymentId: docId };
            // })
            // [TEST Only] set uid = admin id after created
            this.req.description = '';
        });
    }
}
module.exports = PaymentCreateApi;
//# sourceMappingURL=payment-create.js.map