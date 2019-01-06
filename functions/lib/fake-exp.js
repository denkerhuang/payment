"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function fake() {
    console.log("fake");
}
exports.fake = fake;
function myFunc(req, res) {
    console.log('test1 ' + req.method + " " + req.originalUrl);
    if ("/aaaa" === req.originalUrl) {
        aa(req, res);
    }
    if ("/" === req.originalUrl) {
        bb(req, res);
    }
}
exports.myFunc = myFunc;
function aa(req, res) {
    res.send('aa');
}
function bb(req, res) {
    res.send('bb');
}
//# sourceMappingURL=fake-exp.js.map