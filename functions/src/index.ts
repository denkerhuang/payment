// ---- 3rd party modules ----
const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)
const db = admin.firestore()
const settings = {/* your settings... */ timestampsInSnapshots: true }
db.settings(settings)

// ---- project modules ----
const userHandler = require('./handler/user-handler')
const paymentHandler = require('./handler/payment-handler')

export const user = functions.https.onRequest((req, res) => {
    if (!req.path) req.url = "/";
    userHandler.userType(req, res);
});
export const payment = functions.https.onRequest((req, res) => {
    if (!req.path) req.url = "/";
    paymentHandler.appPayment(req, res);
});