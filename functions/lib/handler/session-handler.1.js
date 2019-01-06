"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const appSession = express();
exports.appSession = appSession;
const ApiAuthQry = require('../api/api-auth-qry');
const SessionCreateApi = require('../api/session-create');
// const SessionGetallApi = require('../api/session-getall')
const SessionGetallApi = require('../api/common/session-getall');
// Get all bookable sessions
appSession.get('/', (req, res) => {
    // new SessionGetallApi(req, res).execute();
    SessionGetallApi.execute(new ApiAuthQry(req, res));
});
// Create a session
appSession.post('/', (req, res) => {
    new SessionCreateApi(req, res).execute();
});
//# sourceMappingURL=session-handler.1.js.map