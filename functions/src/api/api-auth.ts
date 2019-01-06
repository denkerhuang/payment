const adminValidate = require('firebase-admin');
const Logger = require('../livingmenu_lib/log-handler')
const LMError = require('../livingmenu_lib/error-handler')
const LMCONST = require('../Constant');
const ApiRoot = require('./api-root')

class ApiAuth extends (ApiRoot as { new(req, res): any }) {

	constructor(req, res) {
		super(req, res)
		req.logPath = this.name
		console.log('ApiAuth constructor')
	}

	check(checkArray) {
		super.check(checkArray)
		console.log('ApiAuth check')
		// const checkArray = []
		// check 1: auth
		checkArray.push(this.auth())
	}

	// verify user auth token
	async auth() {

		try {
			// const idToken = this.req.header('AUTH_TOKEN');
			// console.info('[auth] idToken: ' + idToken);
			// await adminValidate.auth().verifyIdToken(idToken)
			// .then(function (decodedToken) {
			// 	const uid = decodedToken.uid;
			// 	this.req.uid = uid;
			// 	console.info('[auth] user id: ' + uid);
			// })

			// [TEST Only]
			this.req.uid = 'vVJ22AFnJeKKT5QUNViR'

		} catch (error) {
			console.warn(error.message);
			throw new LMError(LMCONST.Unauthorized, {});
		}
	}
}
export = ApiAuth;