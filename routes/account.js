const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const account = require('../database/account');
const apiCallOption = require('../api-call-option');

var router = express.Router();

/**
 * 
 * @param {string} userId 
 * @param {string} userPwd 
 * @returns {{isSuccess: boolean, reason: string, userInfo: {userId: string, userName: string, point: number, favoriteProductId: number[]}}}
 */
const loginPost = async function (userId, userPwd) {
  const result = {
    isSuccess: false,
    reason: 'Please contact the customer service center.',
    userInfo: null
  }
  try {
    const callOptions = apiCallOption.accountApi.login(userId, userPwd);
    const loginResult = await axios(callOptions);
    const loginData = loginResult.data;
    Object.keys(result).forEach((key) => {
      result[key] = loginData[key];
    })
  }
  catch (err) {
    result.isSuccess = false;
    result.reason = 'Please contact the customer service center.';
    result.userInfo = null;
  }
  finally {
    return result;
  }
}

/**
 * 
 * @param {string} userId 
 * @param {{point: number}} changeData 
 * @returns {{isSuccess: boolean, reason: string}}
 */
const changePointPost = async function (userId, changeData) {
  const result = {
    isSuccess: false,
    reason: 'Please contact the customer service center.',
  }
  const sessionId = -1;

  try {
    const callOptions = apiCallOption.accountApi.changePoint(userId, changeData);
    const changeAccountResult = await axios(callOptions);
    const changeAccountData = changeAccountResult.data;
    sessionId = changeAccountData.sessionId;
    result.isSuccess = changeAccountData.isSuccess;
    result.reason = changeAccountData.reason;

    // commit or rollback
    if (result.isSuccess) {
      const callCommitOptions = apiCallOption.accountApi.commit(userId, sessionId);
      const commitAccountResult = await axios(callCommitOptions);
      const commitAccountData = commitAccountResult.data;
      result.userInfo = commitAccountData.userInfo
      //fail to commit > err
      if (!commitAccountData.isSuccess) {
        throw new Error("fail to commit");
      }
    }
    else {
      const callRollbackOptions = apiCallOption.accountApi.rollback(sessionId);
      await axios(callRollbackOptions);
    }
  }
  catch (err) {
    result.isSuccess = false;
    result.reason = 'Please contact the customer service center.';
    result.userInfo = null;
  }
  finally {
    return result;
  }
}

router.get('/login', function (req, res, next) {
  var result = {
    isSuccess: false,
    reason: "고객센터에 문의하세요."
  };

  res.send(result);
});

router.post('/login', async function (req, res, next) {
  var result = null;
  try {
    const userId = req.body.userId;
    const userPwd = req.body.userPwd;

    result = await loginPost(userId, userPwd);
    res.send(result);
  }
  catch (err) {
    next(err);
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

router.post('/charge_point', async function (req, res, next) {
  var result = null;
  try {
    const userId = req.body.userId;
    const changeData = req.body.changeData;

    result = await changePointPost(userId, changeData);
    res.send(result);
  }
  catch (err) {
    next(err);
  }
});

module.exports = router;