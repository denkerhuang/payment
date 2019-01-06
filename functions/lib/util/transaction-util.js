"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const admin = require('firebase-admin');
const db = admin.firestore();
const FsUtil = require('../util/firestore-util');
// const ActionInterface = require('../action/action-interface')
class TransactionManager {
    constructor() {
        this.actions = [];
        this.fsBatch = db.batch();
    }
    addAction(action) {
        this.actions.push(action);
    }
    rollback() {
        console.warn('transaction error, doing rollback!');
        for (const action of this.actions) {
            action.rollback();
        }
    }
    final() {
        console.log('execute txMgr final!');
        for (const action of this.actions) {
            action.final();
        }
    }
    batchAdd(collectionName, dataObject, returnObj) {
        FsUtil.batchAdd(collectionName, dataObject, returnObj, this.fsBatch);
    }
    batchUpd(collectionName, documentId, dataObject) {
        FsUtil.batchUpd(collectionName, documentId, dataObject, this.fsBatch);
    }
    batchDel(collectionName, documentId, dataObject) {
        FsUtil.batchDel(collectionName, documentId, dataObject, this.fsBatch);
    }
    batchCommit() {
        return __awaiter(this, void 0, void 0, function* () {
            yield FsUtil.batchCommit(this.fsBatch);
        });
    }
}
module.exports = TransactionManager;
//# sourceMappingURL=transaction-util.js.map