"use strict";
const ApiAuthSimple = require('./api-auth-simple');
class ApiSauthDel extends ApiAuthSimple {
    constructor(req, res) {
        super(req, res);
        console.log('ApiSauthDel constructor');
    }
    check(checkArray) {
        console.log('ApiSauthDel check');
    }
    final() {
        console.log('ApiSauthDel final');
        // [TODO] 1: send back 200 with obj
    }
}
module.exports = ApiSauthDel;
//# sourceMappingURL=api-sauth-del.js.map