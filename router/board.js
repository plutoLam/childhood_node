const express = require('express')
const router = express.Router()
const { postMessage, giveLike, toGetMessage } = require('../Controller/board')

router.post('/', postMessage)

router.put('/:id', giveLike)

router.get('/', toGetMessage)


module.exports = router