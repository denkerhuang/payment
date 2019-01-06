"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const appServiceType = express();
exports.appServiceType = appServiceType;
const ServiceTypeGetAllApi = require('../api/auth/service-type-getall');
const ServiceTypeCreateApi = require('../api/auth/service-type-create');
// Create a service type
appServiceType.post('/', (req, res) => {
    new ServiceTypeCreateApi(req, res).execute();
});
// Get all service types
appServiceType.get('/', (req, res) => {
    new ServiceTypeGetAllApi(req, res).execute();
});
//# sourceMappingURL=service-type-handler.js.map