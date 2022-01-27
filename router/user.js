const express = require('express')
const router = express.Router()
const { modifyAvatar, register, login } = require('../Controller/user')

router.put('/', modifyAvatar)

router.post('/register', register)

router.post('/login', login)

module.exports = router