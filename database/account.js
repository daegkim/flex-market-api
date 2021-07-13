const mongoose = require('mongoose');
const crypto = require('crypto');
const { error } = require('console');
const accountChangeHist = require('./accountChangeHist');

//schema에 없어도 데이터는 가져오지만 조회가 안된다.
const accountSchema = new mongoose.Schema({
  userId: {type: String, require: true, unique: true},
  userName: {type: String, require: true},
  userPwd: {type: String, require: true},
  point: {type: Number},
  favoriteProductId: {type: Array}
}, { collection: "account" })

accountSchema.statics.findAccount = function(userId) {
  return this.find({
    userId: userId
  });
}

accountSchema.statics.login = function(userId, userPwd) {
  return this.find({
    userId: userId,
    userPwd: userPwd
  });
}

accountSchema.statics.createAccount = function(userId, userName, userPwd){
  return this.insert({
    userId: userId,
    userName: userName,
    userPwd: userPwd,
    point: 0
  });
}

accountSchema.statics.changeAccount = async function(userId, changeData) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const resultFindAccount = await this.findOne({userId: userId}).exec();
    if(!resultFindAccount){
      throw error("userId 찾을 수 없음");
    }

    var prevData = {}
    Object.keys(changeData).forEach((key) => {
      prevData[key] = resultFindAccount[key];
    });

    await this.update({userId: userId}, changeData, { session });
    await accountChangeHist.createHist(userId, prevData, changeData, "CHANGE_VALUE");
    await session.commitTransaction();
    session.endSession();
    return true;
  }
  catch(err) {
    await session.abortTransaction();
    session.endSession();
    return false;
  }
}

module.exports = mongoose.model('account', accountSchema);