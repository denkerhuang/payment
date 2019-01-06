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
class LocationGetAllApi extends ApiAuthQuery {
    constructor(req, res) {
        super(req, res);
        this.name = 'LocationGetAllApi';
        const h = Logger.orgLogHeader(this.name, 'constructor');
        req.apiUrl = '/locations';
        // this.req = req
        // this.res = res
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
            // Action 1: retrieve all docs in Location collection
            yield FsUtil.getWholeFSData(LMCONST.Collection_Location, (docs) => {
                docs.forEach(doc => {
                    //address format: {RoadNumber} {RoadName}, {BuildingNumber}, #{FloorNumber}-{UnitNumber}, {Country} {Postcode}
                    let address = `${doc.data().RoadNumber} ${doc.data().RoadName}, `;
                    if (doc.data().BuildingNumber !== undefined) {
                        address += `${doc.data().BuildingNumber}, `;
                    }
                    if (doc.data().FloorNumber !== undefined) {
                        address += `#${doc.data().FloorNumber}`;
                        if (doc.data().UnitNumber !== undefined) {
                            address += `-${doc.data().UnitNumber}`;
                        }
                        address += ', ';
                    }
                    address += `${doc.data().Country} ${doc.data().Postcode}`;
                    returnArray.push({
                        'LocationId': doc.id,
                        'Address': address,
                        'Postcode': doc.data().Postcode,
                        'Country': doc.data().Country,
                        'BuildingNumber': doc.data().BuildingNumber,
                        'FloorNumber': doc.data().FloorNumber,
                        'UnitNumber': doc.data().UnitNumber,
                        'RoadNumber': doc.data().RoadNumber,
                        'RoadName': doc.data().RoadName
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
module.exports = LocationGetAllApi;
//# sourceMappingURL=location-getall.js.map