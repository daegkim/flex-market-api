const mongoose = require('mongoose');
const { error } = require('console');
const accountChangeHist = require('./accountChangeHist');

//db에 저장을 하는게 맞는 듯..?
var sessions = [];
var lastSessionId = 1;

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
    const resultFindAccount = await this.findOne({userId: userId});
    if(!resultFindAccount){
      throw error("userId 찾을 수 없음");
    }

    var prevData = {}
    Object.keys(changeData).forEach((key) => {
      prevData[key] = resultFindAccount[key];
      if(key === 'point'){
        changeData[key] = prevData[key] + changeData[key];
      }
    });

    await this.updateOne({userId: userId}, changeData, { session });
    await accountChangeHist.createHist(userId, prevData, changeData, "CHANGE_VALUE", session);

    sessions.push({
      session: session,
      sessionId: lastSessionId
    });
    currSessionId = lastSessionId;
    lastSessionId += 1;
    return currSessionId;
  }
  catch(err) {
    await session.abortTransaction();
    session.endSession();
    return {
      isSuccess: false
    }
  }
}

accountSchema.statics.commit = async function(sessionId) {
  var session = null;
  try{
    session = sessions.find((elem) => {
      if(elem.sessionId === sessionId){
        return true;
      }
    }).session;
    await session.commitTransaction();
    session.endSession();

    return {
      isSuccess: true
    }
  }
  catch(err){
    await session.abortTransaction();
    session.endSession();
    return {
      isSuccess: false
    }
  }
};

accountSchema.statics.rollback = async function(sessionId) {
  var session = null;
  try{
    session = sessions.find((elem) => {
      if(elem.sessionId === sessionId){
        return true;
      }
    }).session;
    await session.abortTransaction();
    session.endSession();

    return {
      isSuccess: false
    }
  }
  catch(err){
    await session.abortTransaction();
    session.endSession();
    return {
      isSuccess: false
    }
  }
};

module.exports = mongoose.model('account', accountSchema);