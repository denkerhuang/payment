"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require('firebase-admin');
function sendToDevice(registerToken, payload) {
    admin.messaging().sendToDevice(registerToken, payload, {})
        .then(function (response) {
        console.log('message pushed');
    })
        .catch(function (err) {
        console.error('Firebase has encountered an error.', err);
    });
}
exports.sendToDevice = sendToDevice;
//# sourceMappingURL=messaging-util.js.map