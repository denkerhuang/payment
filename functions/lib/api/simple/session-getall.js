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
const ApiUtil = require('../../util/api-util');
const ApiSauthQry = require('../api-sauth-qry');
const ComSessionGetall = require('../common/session-getall');
class SessionGetallApi extends ApiSauthQry {
    // private rtnAry
    constructor(req, res) {
        super(req, res);
        const h = Logger.orgLogHeader(this.constructor.name, SessionGetallApi.name, 'constructor');
    }
    execute() {
        const h = Logger.orgLogHeader(this.constructor.name, SessionGetallApi.name, 'execute');
        this.check(this, [])
            .catch(error => {
            ApiUtil.sendError(error, this.res);
        });
    }
    check(apiObj, checkArray) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            _super("check").call(this, apiObj, checkArray);
            yield Promise.all(checkArray);
            this.doAction(this);
        });
    }
    doAction(apiObj) {
        const h = Logger.orgLogHeader(this.constructor.name, SessionGetallApi.name, 'doAction');
        this.output = ComSessionGetall.doAction(apiObj);
        apiObj.final();
    }
    final() {
        super.final();
        const h = Logger.orgLogHeader(this.constructor.name, SessionGetallApi.name, 'final');
    }
}
module.exports = SessionGetallApi;
//# sourceMappingURL=session-getall.js.map