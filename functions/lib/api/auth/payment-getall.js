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
const ApiAuthQuery = require('../api-auth-qry');
const ApiUtil = require('../../util/api-util');
const LMCONST = require('../../Constant');
const LMError = require('../../livingmenu_lib/error-handler');
const FsUtil = require('../../util/firestore-util');
class PaymentGetAllApi extends ApiAuthQuery {
    constructor(req, res) {
        super(req, res);
        this.name = 'PaymentGetAllApi';
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
            Logger.orgLogHeader(this.name, 'doAction');
            const Query = this.req.query;
            const checkFields = [];
            const operators = [];
            const conditions = [];
            for (const key of Object.keys(Query)) {
                checkFields.push(key);
                operators.push('==');
                conditions.push(Query[key]);
            }
            const rtnArray = [];
            yield FsUtil.getMulDataComplex(LMCONST.Collection_Payment, checkFields, operators, conditions, result => {
                result.forEach(doc => {
                    rtnArray.push(doc);
                });
            }).catch(err => {
                throw new LMError(LMCONST.FirestoreError, { Message: err.message });
            });
            const tempPayer = Query.Payer;
            const tempReceiver = Query.Receiver;
            if (tempPayer !== undefined) {
                Query.Receiver = tempPayer;
                delete Query.Payer;
            }
            if (tempReceiver !== undefined) {
                Query.Payer = tempReceiver;
            }
            const checkFields2 = [];
            const operators2 = [];
            const conditions2 = [];
            const rtnArray2 = [];
            for (const key of Object.keys(Query)) {
                checkFields2.push(key);
                operators2.push('==');
                conditions2.push(Query[key]);
            }
            yield FsUtil.getMulDataComplex(LMCONST.Collection_Payment, checkFields2, operators2, conditions2, result => {
                result.forEach(doc => {
                    rtnArray2.push(doc);
                });
            }).catch(err => {
                throw new LMError(LMCONST.FirestoreError, { Message: err.message });
            });
            const returnArray = [];
            yield Promise.all(rtnArray.map((doc) => __awaiter(this, void 0, void 0, function* () {
                yield FsUtil.convertFSDocToJSObj(LMCONST.Collection_Payment, doc, result => {
                    returnArray.push(result);
                });
            })));
            yield Promise.all(rtnArray2.map((doc) => __awaiter(this, void 0, void 0, function* () {
                yield FsUtil.convertFSDocToJSObj(LMCONST.Collection_Payment, doc, result => {
                    const tempPayer2 = result.Payer;
                    const tempReceiver2 = result.Receiver;
                    result.Payer = tempReceiver2;
                    result.Receiver = tempPayer2;
                    result.Amount = -result.Amount;
                    returnArray.push(result);
                });
            })));
            this.output = returnArray;
            // }
        });
    }
}
module.exports = PaymentGetAllApi;
//# sourceMappingURL=payment-getall.js.map