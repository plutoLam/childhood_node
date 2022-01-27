/**
 * Created by Walker on 2020/05/06.
 * 消息请求响应
 */
//封装接送模块
let json = function (res, result, err) {
  if (typeof result === "undefined") {
    res.json({
      code: "300",
      msg: "操作失败:" + err,
    });
  } else if (result === "add") {
    res.json({
      code: "2000",
      msg: "添加成功",
    });
  } else if (result === "delete") {
    res.json({
      code: "2000",
      msg: "删除成功",
    });
  } else if (result === "update") {
    res.json({
      code: "2000",
      msg: "更改成功",
    });
  } else if (result.result != "undefined" && result.result === "select") {
    res.json({
      code: "2000",
      msg: "查找成功",
      data: result.data,
    });
  } else {
    res.json({
      code: "2000",
      msg: "API调用成功",
      data: result.data,
    });
  }
};

module.exports = json;

