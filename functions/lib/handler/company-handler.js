"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const appCompany = express();
exports.appCompany = appCompany;
const CompanyGetAllApi = require('../api/auth/company-getall');
// Get all companies
appCompany.get('/', (req, res) => {
    new CompanyGetAllApi(req, res).execute();
});
//# sourceMappingURL=company-handler.js.map