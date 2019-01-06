"use strict";
const ApiAuthSimple = require('./api-auth-simple');
class ApiSauthQry extends ApiAuthSimple {
    constructor(req, res) {
        super(req, res);
        console.log('ApiSauthQry constructor');
    }
    check(checkArray) {
        super.check(this, checkArray);
        console.log('ApiSauthQry check');
    }
    final() {
        super.final();
        console.log('ApiSauthQry final');
    }
}
module.exports = ApiSauthQry;
//# sourceMappingURL=api-sauth-qry.js.map