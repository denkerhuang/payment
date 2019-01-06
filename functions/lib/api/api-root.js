"use strict";
const Logger = require('../livingmenu_lib/log-handler');
class ApiRoot {
    constructor(req, res) {
        this.name = 'ApiRoot';
        res.setHeader("Access-Control-Allow-Origin", "*");
        req.logPath = this.name;
        const h = Logger.orgLogHeader(this.name, 'constructor');
        this.req = req;
        this.res = res;
    }
    check(checkArray) {
        const h = Logger.orgLogHeader(ApiRoot.name, 'check');
    }
    final() {
        const h = Logger.orgLogHeader(ApiRoot.name, 'final');
        this.res.send(this.output);
    }
}
module.exports = ApiRoot;
//# sourceMappingURL=api-root.js.map