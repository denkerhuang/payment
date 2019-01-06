import { ActionInterface } from '../action/action-interface';

const admin = require('firebase-admin')
const db = admin.firestore()
const FsUtil = require('../util/firestore-util')
// const ActionInterface = require('../action/action-interface')
class TransactionManager {
	private actions: ActionInterface[] = []
	private fsBatch = db.batch()

	addAction(action: ActionInterface) {
		this.actions.push(action)
	}

	rollback() {
		console.warn('transaction error, doing rollback!')
		for (const action of this.actions) {
			action.rollback()
		}
	}

	final() {
		console.log('execute txMgr final!')
		for (const action of this.actions) {
			action.final()
		}
	}

	batchAdd(collectionName, dataObject, returnObj) {
		FsUtil.batchAdd(collectionName, dataObject, returnObj, this.fsBatch)
	}
	batchUpd(collectionName, documentId, dataObject) {
		FsUtil.batchUpd(collectionName, documentId, dataObject, this.fsBatch)
	}
	batchDel(collectionName, documentId, dataObject) {
		FsUtil.batchDel(collectionName, documentId, dataObject, this.fsBatch)
	}
	async batchCommit() {
		await FsUtil.batchCommit(this.fsBatch)
	}
}
export = TransactionManager