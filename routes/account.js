const express = require('express');
const crypto = require('crypto');
const request = require('request-promise-native');
const account = require('../database/account');

var router = express.Router();

router.get('/login', function (req, res, next) {
  var result = {
    isSuccess: false,
    reason: "고객센터에 문의하세요."
  };

  res.send(result);
});

router.post('/login', async function (req, res, next) {
  try{
    const userId = req.body.userId;
    const userPwd = req.body.userPwd;
    const options = {
      uri: 'http://localhost:3100/login',
      method: 'post',
      body: {
        userId: userId,
        userPwd: userPwd
      },
      json: true
    }

    var loginResult = await request.post(options);
    res.send(loginResult);
  }
  catch(err) {
    res.send({
      isSuccess: false,
      reason: 'Please contact the customer service center.',
      userInfo: null
    })
  }
});

router.post('/create', function (req, res, next) {
  var userId = req.body.userId;
  var userName = req.body.userName;
  var userPwd = req.body.userPwd;
  var result = {
    isSuccess: false,
    reason: "고객센터에 문의하세요."
  };

  if (userId === null || userId === undefined || userId === ''
    || userPwd === null || userPwd === undefined || userPwd === '') {
    result.reason = "ID나 비밀번호를 입력하세요.";
    res.send(result);
  }
  else {
    crypto.pbkdf2(userPwd, userId, 921118, 64, "sha512", (err, derivedKey) => {
      if (err) {
        console.log(err);
        res.send(result);
        return;
      }

      account.login(userId, derivedKey)
        .then((_result) => {
          if (_result === null || _result === undefined) {
            result.isSuccess = false;
            result.reason = "no account";
          }
          else {
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

router.post('/changeAccount', async function (req, res, next) {
  try {
    var userId = req.body.userId;
    var changeData = req.body.changeData;
    var result = {
      isSuccess: false,
      reason: "고객센터에 문의하세요.",
      afterUserInfo: null
    };

    if (changeData === undefined || changeData === null) {
      result.reason = "변경하려는 값이 입력되지 않았습니다.";
      res.send(result);
    }
    else {
      if (userId === undefined || userId === null) {
        result.reason = "변경하려는 값이 입력되지 않았습니다.";
        res.send(result);
      }
      else {
        const sessionId = await account.changeAccount(userId, changeData);
        const commitResult = await account.commit(sessionId);
        const afterUserInfo = await account.findAccount(userId);

        result.isSuccess = commitResult.isSuccess;
        result.afterUserInfo = {
          userId: afterUserInfo[0].userId,
          userName: afterUserInfo[0].userName,
          point: afterUserInfo[0].point,
          favoriteProductId: afterUserInfo[0].favoriteProductId
        }
        if(result.isSuccess){
          result.reason = null;
        }

        res.send(result);
      }
    }
  }
  catch (err) {
    if(sessionId !== undefined || sessionId !== null){
      const rollbackResult = await account.rollback(sessionId);
    }
    const afterUserInfo = await account.findAccount(userId);
    result.isSuccess = rollbackResult.isSuccess;
    result.afterUserInfo = {
      userId: afterUserInfo[0].userId,
      userName: afterUserInfo[0].userName,
      point: afterUserInfo[0].point,
      favoriteProductId: afterUserInfo[0].favoriteProductId
    }

    res.send(result);
  }
});

module.exports = router;