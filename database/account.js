var mongoose = require('mongoose');
var crypto = require('crypto');

//schema에 없어도 데이터는 가져오지만 조회가 안된다.
const accountSchema = new mongoose.Schema({
  userId: {type: String, require: true, unique: true},
  userName: {type: String, require: true},
  userPwd: {type: String, require: true},
  point: {type: Number},
  favoriteProductId: {type: Array}
}, { collection: "account" })

accountSchema.statics.login = function(userId, userPwd) {
  return this.find({userId: userId, userPwd: userPwd });
}

accountSchema.statics.createAccount = function(userId, userName, userPwd){
  return this.insert({
    userId: userId,
    userName: userName,
    userPwd: userPwd,
    point: 0
  })
}

module.exports = mongoose.model('account', accountSchema);