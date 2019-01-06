"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const appLocation = express();
exports.appLocation = appLocation;
const LocationGetAllApi = require('../api/auth/location-getall');
// Get all locations
appLocation.get('/', (req, res) => {
    new LocationGetAllApi(req, res).execute();
});
//# sourceMappingURL=location-handler.js.map