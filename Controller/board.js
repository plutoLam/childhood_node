const db = require("../db/db.js");
const { jwtVerify } = require('./common')


// 发送信息
const postMessage = async (req, res) => {
  const { content } = req.body
  const uid = await jwtVerify(req, res)
  if (uid) {
    let sqlParam = {
      content,
      create_time: new Date(),
    }
    result = await db.dbQuery('message_board', "insert", sqlParam, 0)
    let mid = result.data.insertId

    sqlParam = {
      mid,
      uid
    }
    await db.dbQuery('user_message', "insert", sqlParam, res).then(result => { })
  }

}

const giveLike = async (req, res) => {
  const uid = await jwtVerify(req, res)
  if (uid) {
    const mid = +req.params.id
    const sqlParam = {
      uid,
      mid,

    }
    // console.log('sqlParam: ', sqlParam);
    const result = await db.dbQuery('user_like', "query", sqlParam, 0,)
    // console.log('result: ', result);

    if (result.data.length) {  // 该用户对该留言已经点赞
      // 点赞数-1
      await db.dbQuery('message_board', "reduce", { mid }, 0)
      await db.dbQuery('user_like', "delete", sqlParam, 0)
      res.json({
        code: 2000,
        msg: '取消点赞'
      })
    } else {
      // 自增点赞数
      await db.dbQuery('message_board', "update", sqlParam, 0)
      await db.dbQuery('user_like', "insert", sqlParam, 0)
      res.json({
        code: 2000,
        msg: '点赞成功'
      })
    }
  }

}

const toGetMessage = async (req, res) => {
  const uid = await jwtVerify(req)
  console.log('uid: ', uid);

  const query = req.query
  let page = query.page || 1;
  let size = query.size || 10;

  // 判断是要根据点赞数排序还是时间排序
  const sqlType = query.sort === 'like' ? 'queryByLike' : 'queryByTime'
  console.log('(page - 1) * size: ', (page - 1) * size);

  const start = parseInt(((page - 1) * size), 10)
  console.log('start: ', start);
  let sqlParam = {
    start,
    size: +size
  }
  console.log('sqlParam: ', sqlParam);
  // 获取留言列表
  const { data } = await db.dbQuery("message_board", sqlType, sqlParam, 0)

  // 遍历留言列表
  for (let item of data) {
    const mid = item.id
    let liked = false
    if (uid) {  // 判断当前用户有没有登录
      const likedData = await db.dbQuery("user_like", "query", { uid, mid }, 0)
      // console.log('likedData: ', likedData);
      liked = !!likedData.data.length
    }


    // 获取留言人的id
    const leaveUser = await db.dbQuery("user_message", "queryByMid", { mid }, 0)
    // console.log('leaveUser: ', leaveUser);
    const leaveUserId = leaveUser.data[0].uid

    // 获取留言人的数据
    const leaveUserData = await db.dbQuery("user", "queryById", { leaveUserId }, 0)
    // console.log('leaveUserData: ', leaveUserData);
    const { username, name, avatar_index } = leaveUserData.data[0]
    item.leaveUserName = username;
    item.leaveUserNetName = name;
    item.liked = liked;
    item.avatarIndex = avatar_index;
    item.likeCount = item.like_count;
    item.createdTime = item.created_time
    // formatDate(new Date(item.created_time))

  }

  const countResult = await db.dbQuery('message_board', 'count', {}, 0)
  // console.log('countResult: ', countResult);
  const messageCount = countResult.data[0]['COUNT(*)']
  // console.log('messageCount: ', messageCount);

  res.json({
    code: 2000,
    data: {
      messageCount,
      messageBoardList: data
    }
  })
}

module.exports = {
  postMessage,
  giveLike,
  toGetMessage
}
