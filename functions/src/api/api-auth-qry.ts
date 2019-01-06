const ApiAuth = require('./api-auth')
const Logger = require('../livingmenu_lib/log-handler')
const ApiUtil = require('../util/api-util')

class ApiAuthQry extends (ApiAuth as { new(req, res): any }) {
	private name = 'ApiAuthQuery'

	constructor(req, res) {
		super(req, res)
		req.logPath = this.name
		const h = Logger.orgLogHeader(this.name, 'constructor')

	}

	check(checkArray) {
		super.check(checkArray)
		const h = Logger.orgLogHeader(this.name, 'check')
	}

	async final() {
		// this.output = await ApiUtil.parseResponse(this.req, this.output)
		super.final()
		Logger.orgLogHeader(this.name, 'final')
	}

}
export = ApiAuthQry;