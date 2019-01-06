"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const appUser = express();
exports.appUser = appUser;
const Logger = require('../../livingmenu_lib/log-handler');
const TempuserCreateApi = require('../../api/simple/tempuser-create');
const FsUtil = require('../../util/firestore-util');
const LMCONST = require('../../Constant');
appUser.post('/', (req, res) => {
    new TempuserCreateApi(req, res).execute();
});
appUser.get('/:UserIds', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const userIdArray = req.params.UserIds.split(",");
    const returnArray = [];
    let Tasksfinished;
    try {
        let endCount = 0;
        userIdArray.forEach(function (UserId) {
            FsUtil.getDocData(LMCONST.Collection_User, UserId, (userObject) => {
                Logger.log('[users/bulk] chef name ' + userObject.Name);
                returnArray.push(userObject);
                if (userIdArray.length === ++endCount) {
                    Tasksfinished = true;
                }
            });
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send('Firebase Error');
    }
    while (true) {
        yield FsUtil.sleep(1000);
        if (Tasksfinished === true) {
            res.send(returnArray);
            break;
        }
    }
}));
//# sourceMappingURL=tempuser-handler.js.map