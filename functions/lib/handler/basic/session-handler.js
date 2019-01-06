"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const appSession = express();
exports.appSession = appSession;
const SessionGetallApi = require('../../api/session-getall');
// Get all bookable sessions
appSession.get('/', (req, res) => {
    new SessionGetallApi(req, res).execute();
});
//# sourceMappingURL=session-handler.js.map