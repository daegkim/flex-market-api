var mongoose = require('mongoose');
var crypto = require('crypto');

const accountSchema = new mongoose.Schema({
  userId: {type: String, require: true, unique: true},
  userName: {type: String, require: true},
  userPwd: {type: String, require: true},
  point: {type: Number}
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