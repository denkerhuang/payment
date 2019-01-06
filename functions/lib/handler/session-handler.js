"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const appSession = express();
exports.appSession = appSession;
const SessionLMCreateApi = require('../api/auth/session-lm-create');
const SessionRQCreateApi = require('../api/auth/session-rq-create');
const SessionRQGetAllApi = require('../api/auth/session-getall');
// Get all bookable sessions
appSession.get('/', (req, res) => {
    new SessionRQGetAllApi(req, res).execute();
});
// Create a session
appSession.post('/livingmenu', (req, res) => {
    new SessionLMCreateApi(req, res).execute();
});
// Create a requested session
appSession.post('/requested', (req, res) => {
    new SessionRQCreateApi(req, res).execute();
});
//# sourceMappingURL=session-handler.js.map