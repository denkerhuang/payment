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
class SessionsGetAllApi extends ApiAuthQuery {
    constructor(req, res) {
        super(req, res);
        this.name = 'SessionsGetAllApi';
        const h = Logger.orgLogHeader(this.name, 'constructor');
        req.apiUrl = '/sessions';
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const h = Logger.orgLogHeader(this.name, 'execute');
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
            const h = Logger.orgLogHeader(this.req.logPath, 'check');
            yield Promise.all(checkArray);
        });
    }
    doAction() {
        return __awaiter(this, void 0, void 0, function* () {
            const h = Logger.orgLogHeader(this.name, 'doAction');
            const returnArray = [];
            // Action 1: retrieve docs in Session collection with filters
            const Query = FsUtil.changeIdToRef(this.req.query);
            const checkFields = [];
            const operators = [];
            const conditions = [];
            for (const key of Object.keys(Query)) {
                if (!key.includes('StartTime')) {
                    checkFields.push(key);
                    operators.push('==');
                    conditions.push(Query[key]);
                }
            }
            const rtnArray = [];
            yield FsUtil.getMulDataComplex(LMCONST.Collection_Session, checkFields, operators, conditions, result => {
                result.forEach(doc => {
                    rtnArray.push(doc);
                });
            }).catch(err => {
                throw new LMError(LMCONST.FirestoreError, { Message: err.message });
            });
            if (Query.hasOwnProperty('StartTime')) {
                FsUtil.rangeFilter(rtnArray, Query, 'StartTime');
            }
            yield Promise.all(rtnArray.map((doc) => __awaiter(this, void 0, void 0, function* () {
                let sessionJSON;
                yield FsUtil.convertFSDocToJSObj(LMCONST.Collection_RQSession, doc, result => {
                    sessionJSON = result;
                });
                if (doc.data().CompanyRef !== undefined) {
                    yield doc.data().CompanyRef.get()
                        .then(res => {
                        Object.keys(res.data()).map(key => {
                            sessionJSON[`Company${key}`] = res.data()[key];
                        });
                        // sessionJSON['CompanyName'] = res.data().CompanyName
                    });
                }
                if (doc.data().LocationRef !== undefined) {
                    yield doc.data().LocationRef.get()
                        .then(res => {
                        Object.keys(res.data()).map(key => {
                            sessionJSON[`Location${key}`] = res.data()[key];
                        });
                        //address format: {RoadNumber} {RoadName}, {BuildingNumber}, #{FloorNumber}-{UnitNumber}, {Country} {Postcode}
                        let address = `${res.data().RoadNumber} ${res.data().RoadName}, `;
                        if (res.data().BuildingNumber !== undefined) {
                            address += `${res.data().BuildingNumber}, `;
                        }
                        if (res.data().FloorNumber !== undefined) {
                            address += `#${res.data().FloorNumber}`;
                            if (res.data().UnitNumber !== undefined) {
                                address += `-${res.data().UnitNumber}`;
                            }
                            address += ', ';
                        }
                        address += `${res.data().Country} ${res.data().Postcode}`;
                        sessionJSON['LocationAddress'] = address;
                    });
                }
                returnArray.push(sessionJSON);
            })));
            this.output = returnArray;
        });
    }
}
module.exports = SessionsGetAllApi;
//# sourceMappingURL=session-getall.js.map