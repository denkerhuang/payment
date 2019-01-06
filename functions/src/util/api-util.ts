import { sleep } from './firestore-util';

const SwaggerParser = require('swagger-parser')
const adminValidate = require('firebase-admin')
const fs = require('fs')

const LMCONST = require('../Constant')
const LMError = require('../livingmenu_lib/error-handler')
const Logger = require('../livingmenu_lib/log-handler')
const FsUtil = require('../util/firestore-util')

export async function checkUserRole(req, targetUserRole, retriesLeft = 5, interval = 500) {
	const h = Logger.orgLogHeader(req.logPath, 'check')
	try {
		Logger.log(`check if User: ${req.uid} owns Role: ${targetUserRole} ${--retriesLeft} times left`, h)

		//DoAction: check if user uid owns the targetUserRole
		await FsUtil.getData(LMCONST.Collection_User, req.uid, user => {
			if (user.Role !== undefined && !user.Role.includes(targetUserRole)) {
				throw new LMError(LMCONST.Forbidden, {})
			} else if (user.Role === undefined) {
				throw new LMError(LMCONST.NotFound,{
					"UserId":req.uid,
					"Target":'[Field] Role'
				})
			}
		})
		return null
	} catch (err) {
		if (req.uid === undefined) {
			if (retriesLeft) {
				if (retriesLeft > 2) {
					Logger.log('retry check user role', h)
				} else {
					Logger.warn('retry check user role more than 3 times', h)
				}
				await sleep(interval)
				return checkUserRole(req, targetUserRole, retriesLeft--)
			} else {
				throw new LMError(LMCONST.ServerError, {})
			}
		} else {
			if (err instanceof LMError) {
				throw err
			} else {
				throw new LMError(LMCONST.ServerError, { Message: err.message })
			}
		}
	}
}

// verify user auth token
export async function auth(req, res, next) {
	let authFlag = false
	const idToken = req.header('AUTH_TOKEN')
	console.info('[auth] idToken: ' + idToken)
	await adminValidate.auth().verifyIdToken(idToken)
		.then(function (decodedToken) {
			const uid = decodedToken.uid
			req.uid = uid
			console.info('[auth] user id: ' + uid)
			authFlag = true
		}).catch(function (error) {
			console.error(error)
			return res.status(401).send('Unauthorized')
		})
	if (authFlag) {
		next()
	}
}

// verify for temp user no auth token
export async function basicAuth(req, res, next) {
	next()
}

// verify given header
export function noAuth(req, res, next) {
	// console.setFunctionName('noAuth')
	if (req.header('APP_AUTH') !== undefined &&
		// ==== APP_AUTH for local testing ====
		req.header('APP_AUTH') === '72LY9LXOKFj2V9MGRFmB') {
		// ==== APP_AUTH for deployment ====
		// req.header('APP_AUTH') === functions.config().living_menu.app) {
		next()
	} else {
		return res.status(401).send('Unauthorized')
	}

}

// function getWholePath(url) {
// 	return url.substr(url.indexOf("/v1") + 3)
// }

function propertiesToOpt(requiredArray, properties) {
	for (const element of requiredArray) {
		delete properties[element]
	}
}

export async function parseParam(req, res) {
	const h = Logger.orgLogHeader(req.logPath, 'parseParam')

	let swagger
	let requiredArray
	let properties
	// await parseSwagger(LMCONST.SwaggerRequest, req, h, (api, reqArray, reqProperties) => {
	// 	swagger = api
	// 	requiredArray = reqArray
	// 	properties = reqProperties
	// })

	let body
	const input: any = {}
	try {
		body = req.body
		Logger.dir(body, h)
	} catch (error) {
		console.warn('The parameter is not correct JSON object.')
		//   new LMError(LMCONST.BadRequest, { "Message": 'The parameter is not correct JSON object format.' }).send(this.res)
		throw new LMError(LMCONST.MalformatJSON, {})
	}

	// // check and parse the first level parameters
	// if (requiredArray !== undefined) {
	// 	Logger.log('requiredArray: ' + requiredArray, h)
	// 	for (const reqKeyString of requiredArray) {
	// 		Logger.debug('required field: ' + reqKeyString + ': ' + body[reqKeyString], h)
	// 		if (body[reqKeyString] === undefined) {
	// 			throw new LMError(LMCONST.MissRequired, { "Required": reqKeyString })
	// 		} else {
	// 			checkDataType(reqKeyString, body, swagger, properties)
	// 			input[reqKeyString] = body[reqKeyString]
	// 		}
	// 	}
	// }

	// // check and parse the optional
	// propertiesToOpt(requiredArray, properties)
	// const keys = Object.keys(properties)
	// for (const optKey of keys) {
	// 	Logger.debug('optional field: ' + optKey + ': ' + body[optKey], h)
	// 	//i.e.: optObj => Name: { type: 'string' }
	// 	if (body[optKey] !== undefined) {
	// 		checkDataType(optKey, body, swagger, properties)
	// 		input[optKey] = body[optKey]
	// 	}
	// }
	// console.dir(input)

	req.input = body
	req.console = console
}

export async function parseResponse(req, output) {
	const h = Logger.orgLogHeader(req.logPath, 'parseResponse')

	let optionalArray
	await parseSwagger(LMCONST.SwaggerResponse, req, h, (optArray) => {
		optionalArray = optArray
	})

	const filterOutputArray = []
	if (optionalArray !== undefined) {
		Logger.log('optionalArray: ' + optionalArray, h)
		output.forEach(outputObj => {
			const filterOutput: any = {}
			for (const optKeyString of optionalArray) {
				Logger.debug('optional field: ' + optKeyString + ': ' + outputObj[optKeyString], h)
				filterOutput[optKeyString] = outputObj[optKeyString]
			}
			filterOutputArray.push(filterOutput)
		})
	}

	return filterOutputArray
	// req.console = console
}

async function parseSwagger(condition, req, h, callback) {
	// use api endpointUrl such as /v1/bookings/preview to determine the required fields
	const method = req.method.toLowerCase()
	req.originalUrl = req.originalUrl.split('?')[0]
	if (req.originalUrl === '/') req.originalUrl = ''
	const endpointUrl = req.apiUrl + req.originalUrl
	Logger.log(`method: ${method}, path: ${endpointUrl}`, h)

	if (!fs.existsSync(LMCONST.YamlFile)) {
		Logger.warn(`swagger file: ${LMCONST.YamlFile} doesn't exist`, h)
		throw new LMError(LMCONST.SwaggerError, {})
	}

	await SwaggerParser.parse(LMCONST.YamlFile)
		.then(api => {
			Logger.debug(`API name: ${api.info.title}, Version: ${api.info.version}`, h)
			let ref
			let refArr
			let schema
			switch (condition) {
				case LMCONST.SwaggerRequest:
					ref = api.paths[endpointUrl][method].requestBody.content['application/json'].schema.$ref
					refArr = ref.split('/')
					schema = api[refArr[1]][refArr[2]][refArr[3]]
					callback(api, schema.required, schema.properties)
					break

				case LMCONST.SwaggerResponse:
					ref = api.paths[endpointUrl][method].responses['200'].content['application/json'].schema.items.$ref
					refArr = ref.split('/')
					schema = api[refArr[1]][refArr[2]][refArr[3]]
					callback(schema.required)
					break
			}
		}).catch(function (err) {
			Logger.warn('something went wrong while parsing swagger file:' + err.message, h)
			throw new LMError(LMCONST.SwaggerError, {})
		})
}

function checkDataType(key, body, swagger, properties) {
	switch (properties[key].type) {
		case LMCONST.Datatype_String:
			if (typeof body[key] !== LMCONST.Datatype_String) {
				throw new LMError(LMCONST.DataTypeError, { Target: key })
			}
			break
		case LMCONST.Datatype_Integer:
			if (typeof body[key] !== LMCONST.Datatype_Number) {
				throw new LMError(LMCONST.DataTypeError, { Target: key })
			}
			break
		case LMCONST.Datatype_Number:
			if (properties[key].format === 'unix-timestamp') {
				const date = new Date(body[key])
				if (!(date instanceof Date) || isNaN(date.getTime())) {
					throw new LMError(LMCONST.DataTypeError, { Target: key })
				}
			} else {
				if (typeof body[key] !== LMCONST.Datatype_Number) {
					throw new LMError(LMCONST.DataTypeError, { Target: key })
				}
			}
			break
		case LMCONST.Datatype_Boolean:
			if (typeof body[key] !== LMCONST.Datatype_Boolean) {
				throw new LMError(LMCONST.DataTypeError, { Target: key })
			}
			break
		case LMCONST.Datatype_Array:
			if (!Array.isArray(body[key])) {
				throw new LMError(LMCONST.DataTypeError, { Target: key })
			}
			break
		default:	//type undefined, should use $ref
			const ref = properties[key].$ref
			const refArr = ref.split('/')
			const checkRef = swagger[refArr[1]][refArr[2]][refArr[3]]
			let enumValues
			enumValues = Object.keys(checkRef.enum).map((key) => checkRef.enum[key])
			if (typeof body[key] !== checkRef.type || !enumValues.includes(body[key])) {
				throw new LMError(LMCONST.DataTypeError, { Target: key })
			}
	}
}

export function sendError(error, res) {
	// console.warn('[sendError] ' + error)
	// if (error.constructor.name === LMError.constructor.name) {
	if (error instanceof LMError) {
		console.warn(`[LM Error] ${error.obj.ErrorCode}: ${error.obj.Message}`)
		error.send(res)
	} else {
		console.warn('[General Error]' + error.message)
		new LMError(LMCONST.ServerError, { "Message": error.message }).send(res)
	}
}