"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const appSession = express();
exports.appSession = appSession;
// const SessionGetallApi = require('../../api/simple/session-getall')
const ApiSauthQry = require('../../api/api-sauth-qry');
const SessionGetallApi = require('../../api/common/session-getall');
// Get all bookable sessions
appSession.get('/', (req, res) => {
    // new SessionGetallApi(req, res).execute();
    SessionGetallApi.execute(new ApiSauthQry(req, res));
});
//# sourceMappingURL=session-handler.js.map