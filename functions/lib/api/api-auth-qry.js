"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const ApiAuth = require('./api-auth');
const Logger = require('../livingmenu_lib/log-handler');
const ApiUtil = require('../util/api-util');
class ApiAuthQry extends ApiAuth {
    constructor(req, res) {
        super(req, res);
        this.name = 'ApiAuthQuery';
        req.logPath = this.name;
        const h = Logger.orgLogHeader(this.name, 'constructor');
    }
    check(checkArray) {
        super.check(checkArray);
        const h = Logger.orgLogHeader(this.name, 'check');
    }
    final() {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            // this.output = await ApiUtil.parseResponse(this.req, this.output)
            _super("final").call(this);
            Logger.orgLogHeader(this.name, 'final');
        });
    }
}
module.exports = ApiAuthQry;
//# sourceMappingURL=api-auth-qry.js.map