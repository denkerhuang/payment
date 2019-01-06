const ApiAuth = require('./api-auth')
const Logger = require('../livingmenu_lib/log-handler')
const ApiUtil = require('../util/api-util')
const FsUtil = require('../util/firestore-util')

class ApiAuthAlter extends (ApiAuth as { new(req, res): any }){
	private name = 'ApiAuthAlter'

	constructor(req, res) {
		super(req, res)
		req.logPath = this.name
		const h = Logger.orgLogHeader(this.name, 'constructor')
	}

	check(checkArray){
		super.check(checkArray)
		const h = Logger.orgLogHeader(this.name, 'check')
		
		// check 1: parse params and check required fields
		checkArray.push(ApiUtil.parseParam(this.req, this.res))
	}

	final(){
		super.final()
		const h = Logger.orgLogHeader(this.name, 'final')
		
		// FsUtil.record(this.req)
	}

}
export = ApiAuthAlter