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
const FsUtil = require('../../util/firestore-util');
class CompanyGetAllApi extends ApiAuthQuery {
    constructor(req, res) {
        super(req, res);
        this.name = 'CompanyGetAllApi';
        const h = Logger.orgLogHeader(this.name, 'constructor');
        req.apiUrl = '/companies';
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
            // Action 1: retrieve all docs in Company collection
            yield FsUtil.getWholeFSData(LMCONST.Collection_Company, (docs) => {
                docs.forEach(doc => {
                    //address format: {BillingRoadNumber} {BillingRoadName}, {BillingBuildingNumber}, #{BillingFloorNumber}-{BillingUnitNumber}, {BillingCountry} {BillingPostcode}
                    let address = `${doc.data().BillingRoadNumber} ${doc.data().BillingRoadName}, `;
                    if (doc.data().BillingBuildingNumber !== undefined) {
                        address += `${doc.data().BillingBuildingNumber}, `;
                    }
                    if (doc.data().BillingFloorNumber !== undefined) {
                        address += `#${doc.data().BillingFloorNumber}`;
                        if (doc.data().BillingUnitNumber !== undefined) {
                            address += `-${doc.data().BillingUnitNumber}`;
                        }
                        address += ', ';
                    }
                    address += `${doc.data().BillingCountry} ${doc.data().BillingPostcode}`;
                    returnArray.push({
                        'CompanyId': doc.id,
                        'CompanyName': doc.data().CompanyName,
                        'BillingAddress': address,
                        'BillingPostcode': doc.data().BillingPostcode,
                        'BillingCountry': doc.data().BillingCountry,
                        'BillingBuildingNumber': doc.data().BillingBuildingNumber,
                        'BillingFloorNumber': doc.data().BillingFloorNumber,
                        'BillingUnitNumber': doc.data().BillingUnitNumber,
                        'BillingRoadNumber': doc.data().BillingRoadNumber,
                        'BillingRoadName': doc.data().BillingRoadName
                    });
                });
            });
            this.output = returnArray;
        });
    }
    final() {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            yield _super("final").call(this);
            const h = Logger.orgLogHeader(this.name, 'final');
        });
    }
}
module.exports = CompanyGetAllApi;
//# sourceMappingURL=company-getall.js.map