const jwt = require('jsonwebtoken')
const db = require("../db/db.js");

// jwt验证
const jwtVerify = (req, res) => {
  return new Promise((resolve, reject) => {
    const token = req.headers.authorization
    jwt.verify(token, 'abcd', async (err, decode) => {
      if (err) {
        if (res) {
          res.json({
            code: 2005,
            msg: '未登录'
          })
        }

        resolve(false)
      } else {
        let sqlParam = {
          username: decode.username
        }

        // 利用token取出用户id
        let result = await db.dbQuery('user', 'queryByUsername', sqlParam, 0,)
        resolve(result.data[0].id)
      }
    })
  })

}

module.exports = {
  jwtVerify
}