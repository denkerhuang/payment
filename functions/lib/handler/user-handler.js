"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const userType = express();
exports.userType = userType;
const UserGetAllApi = require('../api/auth/user-getall');
const UserCreateApi = require('../api/auth/user-create');
// Create a service type
userType.post('/', (req, res) => {
    new UserCreateApi(req, res).execute();
});
// Get all service types
userType.get('/', (req, res) => {
    new UserGetAllApi(req, res).execute();
});
//# sourceMappingURL=user-handler.js.map