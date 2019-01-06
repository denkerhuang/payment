const messageObj = {
	"100": {
		StatusCode: "400",
		Message: "The parameter is not correct JSON object."
	},
	"101": {
		StatusCode: "400",
		Message: "The request was unacceptable, often due to missing a required parameter."
	},
	"102": {
		StatusCode: "400",
		Message: "Some data are in wrong type."
	},
	"200": {
		StatusCode: "401",
		Message: "No valid API key provided."
	},
	"300": {
		StatusCode: "402",
		Message: "The parameters were valid but the request failed."
	},
	"301": {
		StatusCode: "402",
		Message: "Something went wrong on Firestore service."
	},
	"302": {
		StatusCode: "402",
		Message: "Something went wrong on Stripe service."
	},
	"303": {
		StatusCode: "402",
		Message: "can't parse Swagger file correctly."
	},
	"310": {
		StatusCode: "402",
		Message: "Booking status is incorrect."
	},
	"311": {
		StatusCode: "402",
		Message:"Order status is incorrect."
	},
	"312": {
		StatusCode: "402",
		Message:"Session status is incorrect."
	},
	"313":{
		StatusCode: "402",
		Message:"Station status is incorrect."
	} ,
	"403": {
		StatusCode: "403",
		Message:"Your role doesn't have such operation permission."
	},
	"404": {
		StatusCode: "404",
		Message:"Some data missing."
	},
	"600": {
		StatusCode: "409",
		Message:"The data already exist."
	},
	"601": {
		StatusCode: "409",
		Message:"The data conflict with existing data by rule"
	},
	"602": {
		StatusCode: "409",
		Message:"The data conflict with existing data unique key"
	},
	"429": {
		StatusCode: "429",
		Message:"Too many requests hit the API too quickly. We recommend an exponential backoff of your requests."
	},
	"500": {
		StatusCode: "500",
		Message: "Something went wrong on server side."
	}
}

class LMError extends Error {
	private StatusCode
	//   private code
	private obj
	message

	constructor(ErrorCode, obj) {
		super()
		this.StatusCode = messageObj[ErrorCode].StatusCode
		this.obj = obj
		obj.ErrorCode = ErrorCode

		if (obj.Message === undefined) {
			this.obj.Message = messageObj[ErrorCode].Message
		}
		this.message = this.obj.Message
	}

	send(response) {
		// this.obj
		response.status(this.StatusCode).json(this.obj)
	}
}
export = LMError
