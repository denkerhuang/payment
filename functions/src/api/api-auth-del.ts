const ApiAuthSimple = require('./api-auth-simple')
const Logger = require('../livingmenu_lib/log-handler')

class ApiAuthDel extends (ApiAuthSimple as { new(req, res): any }){

	constructor(req, res) {
		super(req, res)
		const h = Logger.orgLogHeader(req.apiname, ApiAuthDel.name, 'constructor')
		
	}

	check(checkArray){
		console.log('ApiAuthDel check')
	}

	final(){
		console.log('ApiAuthDel final')
		// [TODO] 1: send back 200 with obj
	}

}
export = ApiAuthDel;