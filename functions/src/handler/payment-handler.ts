const express = require('express')
const appPayment = express()
const PaymentGetAllApi = require('../api/auth/payment-getall')
const PaymentCreateApi = require('../api/auth/payment-create')
const PaymentConfirmApi = require('../api/auth/payment-confirm')

// Create a Payment type
appPayment.post('/', (req, res) => {
  new PaymentCreateApi(req, res).execute()
})

// Confirm a Payment
appPayment.patch('/:PaymentId/confirm', (req, res) => {
  new PaymentConfirmApi(req, res).execute()
})

// Get all Payment types
appPayment.get('/', (req, res) => {
  new PaymentGetAllApi(req, res).execute()
})

export { appPayment }
