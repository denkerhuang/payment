"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Logger = require('../livingmenu_lib/log-handler');
const LMError = require('../livingmenu_lib/error-handler');
const LMCONST = require('../Constant');
const ApiRoot = require('./api-root');
class ApiAuthSimple extends ApiRoot {
    constructor(req, res) {
        super(req, res);
        this.name = 'ApiAuthSimple';
        const h = Logger.orgLogHeader(this.name, 'constructor');
    }
    check(checkArray) {
        super.check(checkArray);
        const h = Logger.orgLogHeader(this.name, 'check');
        // check 1: simple auth in header
        checkArray.push(this.simpleAuth());
    }
    // verify given header
    simpleAuth() {
        return __awaiter(this, void 0, void 0, function* () {
            const h = Logger.orgLogHeader(this.name, 'simpleAuth');
            if (this.req.header('APP_AUTH') !== undefined &&
                // ==== APP_AUTH for local testing ====
                this.req.header('APP_AUTH') === '72LY9LXOKFj2V9MGRFmB') {
                // ==== APP_AUTH for deployment ====
                // this.req.header('APP_AUTH') === functions.config().living_menu.app) {
            }
            else {
                Logger.warn('auth failed', h);
                throw new LMError(LMCONST.Unauthorized, {});
            }
        });
    }
}
module.exports = ApiAuthSimple;
//# sourceMappingURL=api-auth-simple.js.map