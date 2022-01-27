const express = require('express')
const router = express.Router()
const user = require('./user')
const board = require('./board')

router.all('/', (req, res, next) => {
  res.send('welcome')
  next();
})

router.use('/user', user)
router.use('/message-board', board)

module.exports = router