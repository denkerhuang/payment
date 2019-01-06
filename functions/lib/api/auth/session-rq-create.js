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
class SessionRQCreateApi extends ApiAuthAlter {
    constructor(req, res) {
        super(req, res);
        this.name = 'SessionRQCreateApi';
        const h = Logger.orgLogHeader(SessionRQCreateApi.name, 'constructor');
        req.apiUrl = '/sessions';
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const h = Logger.orgLogHeader(SessionRQCreateApi.name, 'execute');
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
            // Check 1: check user role === admin
            checkArray.push(ApiUtil.checkUserRole(this.req, LMCONST.Role_Admin));
            yield Promise.all(checkArray);
        });
    }
    doAction() {
        return __awaiter(this, void 0, void 0, function* () {
            const h = Logger.orgLogHeader(SessionRQCreateApi.name, 'doAction');
            const Input = this.req.input;
            // Action 1: insert data into session collection
            Input.StartTime = new Date(Input.StartTime);
            if (Input.EndTime !== undefined) {
                Input.EndTime = new Date(Input.EndTime);
            }
            Input.Status = LMCONST.SessionStatus_New;
            Input.SessionType = LMCONST.SessionType_RQ;
            Input.SessionNumber = yield this.genSessionNumber();
            let sessionId;
            yield FsUtil.addDataPlusChecking(LMCONST.Collection_Session, this.req.input, (docId) => {
                this.output = { SessionId: docId };
                sessionId = docId;
            });
            // [TEST Only] set uid = admin id after created
            this.req.description = `create session ${sessionId} success`;
        });
    }
    genSessionNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            let sessionNumber = 1;
            yield FsUtil.getLastData(LMCONST.Collection_Session, 'SessionNumber', (doc) => {
                if (doc !== null) {
                    sessionNumber = doc.data().SessionNumber + 1;
                }
            });
            console.log(`sessionNumber: ${sessionNumber} generated`);
            return sessionNumber;
        });
    }
}
module.exports = SessionRQCreateApi;
//# sourceMappingURL=session-rq-create.js.map