const admin = require('firebase-admin')
export function sendToDevice(registerToken, payload) {
	admin.messaging().sendToDevice(registerToken, payload, {})
	.then(function(response){
		console.log('message pushed')
	})
	.catch(function(err) {
		console.error('Firebase has encountered an error.', err)
	})
	
}