const ApiUtil = require('./api-util')
class HandlerUtil {
	private req
	private res
	private continue

	constructor(req, res, next) {
    console.log(', optionalParams')
		this.req = req
		this.res = res
		// this.continue = ApiUtil.parseParam(req, res, next)
	}
	  
	run(mainFunc) {
		if(this.continue){
			console.log(', optionalParams')
			mainFunc(this.req, this.res)
		}
	}

}
export = HandlerUtil