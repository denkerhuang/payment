const express = require('express')
const userType = express()
const UserGetAllApi = require('../api/auth/user-getall')
const UserCreateApi = require('../api/auth/user-create')

// Create a service type
userType.post('/', (req, res) => {
  new UserCreateApi(req, res).execute()
})

// Get all service types
userType.get('/', (req, res) => {
  new UserGetAllApi(req, res).execute()
})

export { userType }
