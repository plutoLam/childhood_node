const user = {
  insert: "INSERT INTO user(username,password,name,avatar_index) VALUES(?,?,?,?)",
  query: "SELECT * FROM user WHERE username = ? AND password = ?",
  queryById: "SELECT * FROM user WHERE id = ?",
  queryByUsername: "SELECT * FROM user WHERE username = ?",
  update: "UPDATE user SET avatar_index = ? WHERE id = ?"
}

const user_like = {
  insert: "INSERT INTO user_like(uid,mid) VALUES(?,?)",
  delete: "DELETE FROM user_like WHERE id=?",
  queryByUid: "SELECT * FROM user_like WHERE uid=?",
  query: "SELECT * FROM user_like WHERE uid=? AND mid=?",
  delete: "DELETE FROM user_like WHERE uid=? AND mid=?"
}

const user_message = {
  insert: "INSERT INTO user_message(mid,uid) VALUES(?,?)",
  queryByMid: "SELECT * FROM user_message WHERE mid=?",
}

const message_board = {
  insert: "INSERT INTO message_board(content,created_time) VALUES(?,?)",
  queryAll: "SELECT * FROM message_board",
  queryByLike: "SELECT * FROM message_board ORDER BY like_count DESC LIMIT ?,?",
  queryByTime: "SELECT * FROM message_board ORDER BY created_time DESC LIMIT ?,?",
  update: "UPDATE message_board SET like_count=like_count+1 WHERE id = ?",
  reduce: "UPDATE message_board SET like_count=like_count-1 WHERE id = ?",
  count: "SELECT COUNT(*) FROM message_board",
}

module.exports = {
  user,
  user_like,
  user_message,
  message_board
}