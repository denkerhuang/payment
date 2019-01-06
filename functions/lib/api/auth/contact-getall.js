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
class ContactsGetAllApi extends ApiAuthQuery {
    constructor(req, res) {
        super(req, res);
        this.name = 'ContactsGetAllApi';
        const h = Logger.orgLogHeader(this.name, 'constructor');
        req.apiUrl = '/users';
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
            let returnArray = [];
            // Action 1: retrieve all docs in User collection, where Role = contact
            yield FsUtil.getWholeFSData(LMCONST.Collection_User, (docs) => {
                docs.forEach(doc => {
                    if (doc.data().Role !== undefined && doc.data().Role.includes(LMCONST.Role_Contact)) {
                        const returnObj = {
                            'UserId': doc.id,
                            'Email': doc.data().Email,
                            'FullName': `${doc.data().FirstName} ${doc.data().Surname}`,
                            'FirstName': doc.data().FirstName,
                            'Surname': doc.data().Surname,
                            'Phone': doc.data().Phone
                        };
                        if (doc.data().Phone2 !== undefined)
                            returnObj['Phone2'] = doc.data().Phone2;
                        returnArray.push(returnObj);
                    }
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
module.exports = ContactsGetAllApi;
//# sourceMappingURL=contact-getall.js.map