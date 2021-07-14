var express = require('express');
var account = require('../database/account');
var crypto = require('crypto');
var router = express.Router();

router.get('/login', function(req, res, next){
  var result = {
    isSuccess: false,
    reason: "고객센터에 문의하세요."
  };

  res.send(result);
});

router.post('/login', function(req, res, next) {
  var userId = req.body.userId;
  var userPwd = req.body.userPwd;
  var result = {
    isSuccess: false,
    reason: "고객센터에 문의하세요.",
    userInfo: null
  };

  if(userId === null || userId === undefined || userId === ''
  || userPwd === null || userPwd === undefined || userPwd === ''){
    result.reason = "ID나 비밀번호를 입력하세요.";
    res.send(result);
  }
  else {
    crypto.pbkdf2(userPwd, 'salt', 100000, 64, "sha512", (err, derivedKey) => {
      if(err) {
        console.log(err);
        res.send(result);
      }

      account.login(userId, derivedKey.toString('hex'))
      .then((_result) => {
        if(_result === null || _result === undefined || _result.length === 0){
          result.isSuccess = false;
          result.reason = "no account";
        }
        else if(_result.length > 1){
          result.isSuccess = false;
          result.reason = "duplicate account";
        }
        else{
          result.isSuccess = true;
          result.reason = null;
          result.userInfo = {
            userId: _result[0].userId,
            userName: _result[0].userName,
            point: _result[0].point,
            favoriteProductId: _result[0].favoriteProductId
          }
        }
        res.send(result);
      })
      .catch((reason) => {
        console.log(reason);
        res.send(result);
      });
    });
  }
});

router.post('/changeAccount', async function(req, res, next) {
  var userId = req.body.userId;
  var changeData = req.body.changeData;
  var result = {
    isSuccess: false,
    reason: "고객센터에 문의하세요.",
    afterUserInfo: null
  };

  if(changeData === undefined || changeData === null){
    result.reason = "변경하려는 값이 입력되지 않았습니다.";
    res.send(result);
  }
  else{
    if(userId === undefined || userId === null){
      result.reason = "변경하려는 값이 입력되지 않았습니다.";
      res.send(result);
    }
    else{
      const changeResult = await account.changeAccount(userId, changeData);
      result.isSuccess = changeResult.isSuccess;
      result.reason = null;
      result.afterUserInfo = changeResult.afterUserInfo;
      res.send(result);
    }
  }
});

router.post('/create', function(req, res, next) {
  var userId = req.body.userId;
  var userName = req.body.userName;
  var userPwd = req.body.userPwd;
  var result = {
    isSuccess: false,
    reason: "고객센터에 문의하세요."
  };

  if(userId === null || userId === undefined || userId === ''
  || userPwd === null || userPwd === undefined || userPwd === ''){
    result.reason = "ID나 비밀번호를 입력하세요.";
    res.send(result);
  }
  else {
    crypto.pbkdf2(userPwd, userId, 921118, 64, "sha512", (err, derivedKey) => {
      if(err){
        console.log(err);
        res.send(result);
        return;
      }

      account.login(userId, derivedKey)
      .then((_result) => {
        if(_result === null || _result === undefined){
          result.isSuccess = false;
          result.reason = "no account";
        }
        else{
          result.isSuccess = true;
          result.reason = null;
        }
        res.send(result);
      })
      .catch((reason) => {
        console.log(reason);
        res.send(result);
      });
    });
  }
});

module.exports = router;