const Logger = require('../livingmenu_lib/log-handler')

class ApiRoot {
	private req
	private res
	private name = 'ApiRoot'
	private output // could be JSON object or array

	constructor(req, res) {
		res.setHeader("Access-Control-Allow-Origin", "*")
		req.logPath = this.name
		const h = Logger.orgLogHeader(this.name, 'constructor')
    	
		this.req = req
		this.res = res
	}

	check(checkArray){
		const h = Logger.orgLogHeader(ApiRoot.name, 'check')
	}

	final(){
		const h = Logger.orgLogHeader(ApiRoot.name, 'final')
		this.res.send(this.output)
	}

}
export = ApiRoot