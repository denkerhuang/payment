"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const adminValidate = require('firebase-admin');
const Logger = require('../livingmenu_lib/log-handler');
const LMError = require('../livingmenu_lib/error-handler');
const LMCONST = require('../Constant');
const ApiRoot = require('./api-root');
class ApiAuth extends ApiRoot {
    constructor(req, res) {
        super(req, res);
        req.logPath = this.name;
        console.log('ApiAuth constructor');
    }
    check(checkArray) {
        super.check(checkArray);
        console.log('ApiAuth check');
        // const checkArray = []
        // check 1: auth
        checkArray.push(this.auth());
    }
    // verify user auth token
    auth() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const idToken = this.req.header('AUTH_TOKEN');
                // console.info('[auth] idToken: ' + idToken);
                // await adminValidate.auth().verifyIdToken(idToken)
                // .then(function (decodedToken) {
                // 	const uid = decodedToken.uid;
                // 	this.req.uid = uid;
                // 	console.info('[auth] user id: ' + uid);
                // })
                // [TEST Only]
                this.req.uid = 'vVJ22AFnJeKKT5QUNViR';
            }
            catch (error) {
                console.warn(error.message);
                throw new LMError(LMCONST.Unauthorized, {});
            }
        });
    }
}
module.exports = ApiAuth;
//# sourceMappingURL=api-auth.js.map