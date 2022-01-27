const md5 = require('md5-node')
const db = require("../db/db.js");
const jwt = require('jsonwebtoken')
const { jwtVerify } = require('./common')

const modifyAvatar = async (req, res) => {
  const { avatarIndex } = req.body;
  const uid = await jwtVerify(req, res);
  if (!uid) return;
  const sqlParam = {
    avatarIndex: +avatarIndex,
    uid
  };
  console.log('sqlParam: ', sqlParam);
  db.dbQuery('user', 'update', sqlParam, res).then(result => {
    console.log(result);
  })
}

const register = (req, res) => {
  // res.send('register')
  let body = req.body;
  console.log("dbAdd", req.body);

  let sqlParam = {
    username: body.username,
    password: md5(body.password),
  }
  db.dbQuery("user", "query", sqlParam, 0).then((result) => {
    console.log(result);
    if (result.data.length) {
      res.json({
        code: "300",
        msg: "该用户名已被注册",
      });
    } else {
      sqlParam = {
        username: body.username,
        password: md5(body.password),
        name: body.name,
        avatar_index: body.avatarIndex + '',
      };
      db.dbQuery("user", "insert", sqlParam, res);
    }
  })
}

const login = (req, res) => {
  let body = req.body;
  let sqlParam = {
    username: body.username,
    password: md5(body.password),
  }
  console.log('sqlParam: ', sqlParam);
  db.dbQuery("user", "query", sqlParam, 0).then((result) => {
    console.log(result);

    if (result.data.length) {
      const { username, name, avatar_index } = result.data[0];
      res.json({
        code: "2000",
        msg: "登录成功",

        data: {
          username,
          name,
          avatarIndex: avatar_index,
          token: jwt.sign(sqlParam, 'abcd', {
            // 过期时间
            expiresIn: "24h"
          }),

        }

      });
    } else {
      res.json({
        code: "2003",
        msg: "用户名或密码错误",
      });
    }
  })
}

exports.modifyAvatar = modifyAvatar;
exports.register = register;
exports.login = login;

