const mysql = require("mysql");
const $dbConfig = require("./dbConfig");
const sql = require("./sql.js"); //sql语句封装
const pool = mysql.createPool($dbConfig); // 使用连接池，避免开太多的线程，提升性能
const json = require("./json");


let dbAdd = (table, req, res) => {
  pool.getConnection((err, connection) => {
    const paramValue = paramList(req);
    connection.query(sql[table].insert, [...paramValue], (err, result) => {
      if (result) {
        result = "add"
      }

      if (res) {
        json(res, result, err);
      } else {
        return result;
      }

      connection.release();
    })
  })
}

let dbQuery = (table, sqlStatement, req, res) => {
  // console.log('sqlStatement: ', sqlStatement);
  // console.log('sql', sql[table][sqlStatement]);

  return new Promise((resolve, reject) => {
    let paramValue = paramList(req);
    pool.getConnection((err, connection) => {
      connection.query(sql[table][sqlStatement], [...paramValue], (err, result) => {
        // console.log('result: ', result);
        if (result) {
          var _result = result;
          result = {
            result: "",
            data: _result,
          };
        } else {
          result = undefined;
        }
        if (res) {
          json(res, result, err);
        }
        resolve(result);
        connection.release();
      });
    });
  })

};

/**
 * @description 遍历数据的值
 * @param {obj} obj 包含参数的对象
 * */
let paramList = (obj) => {
  let paramArr = [];
  for (let key in obj) {

    // 这里不能直接判，若传0进来会被认为是FALSE
    if (obj[key] != undefined && obj[key] != null) {
      paramArr.push(obj[key]);
    }
  }
  return paramArr;
};

module.exports = {
  dbAdd,
  dbQuery
}