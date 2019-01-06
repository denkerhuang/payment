"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PaymentGetAllApi = require('./api/auth/payment-getall');
const PaymentCreateApi = require('./api/auth/payment-create');
function myFunc(req, res) {
    console.log('test1 ' + req.method + " " + req.originalUrl);
    if ("/aaaa" === req.originalUrl) {
        aa(req, res);
    }
    if ("/" === req.originalUrl && "GET" === req.method) {
        new PaymentGetAllApi(req, res).execute();
    }
    if ("" === req.originalUrl && "GET" === req.method) {
        bb(req, res);
    }
}
exports.myFunc = myFunc;
function aa(req, res) {
    console.log(req.baseUrl);
    var parentUrl = req.baseUrl || '';
    console.log(req.url);
    res.send('aa');
}
function bb(req, res) {
    res.send('bb');
}
// function post('/', (req, res) => {
// new PaymentCreateApi(req, res).execute()
//   })
// function de(a,b)
//# sourceMappingURL=test-handler.js.map