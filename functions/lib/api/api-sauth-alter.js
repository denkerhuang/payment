"use strict";
const ApiAuthSimple = require('./api-auth-simple');
// const SwaggerPath = require('path')
const Logger = require('../livingmenu_lib/log-handler');
const ApiUtil = require('../util/api-util');
const FsUtil = require('../util/firestore-util');
// this is for get post and simple authentication usage
class ApiSauthAlter extends ApiAuthSimple {
    constructor(req, res) {
        super(req, res);
        this.name = 'ApiSauthAlter';
        // req.logPath = this.name
        const h = Logger.orgLogHeader(this.name, 'constructor');
    }
    check(checkArray) {
        super.check(checkArray);
        this.req.logPath = this.name;
        const h = Logger.orgLogHeader(this.name, 'check');
        // check 1: parse params and check required fields
        checkArray.push(ApiUtil.parseParam(this.req, this.res));
    }
    final() {
        super.final();
        const h = Logger.orgLogHeader(this.name, 'final');
        // for simple auth alter, we only have temp user, so we have to record description = 'temp user'
        FsUtil.record(this.req);
    }
}
module.exports = ApiSauthAlter;
//# sourceMappingURL=api-sauth-alter.js.map