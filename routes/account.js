const express = require('express');
const router = express.Router();
const flexApiCaller = require('../flex-api-caller/flex-api-caller');

router.post('/login', async function (req, res, next) {
  const result = {
    isSuccess: false,
    reason: 'Please contact the customer service center.',
    userInfo: null
  }

  try {
    const userId = req.body.userId;
    const userPwd = req.body.userPwd;
    const loginResult = await flexApiCaller.accountCaller.login(userId, userPwd);
    Object.keys(result).forEach((key) => {
      result[key] = loginResult[key];
    });
  }
  catch (err) {
    result.isSuccess = false;
    result.reason = 'Please contact the customer service center.';
    result.userInfo = null;
  }
  finally {
    res.send(result);
  }
});

router.post('/create', function (req, res, next) {
});

router.post('/charge_point', async function (req, res, next) {
  const result = {
    isSuccess: false,
    reason: 'Please contact the customer service center.',
    userInfo: null
  }

  try {
    const userId = req.body.userId;
    const changeData = req.body.changeData;

    const changePointResult = await flexApiCaller.accountCaller.changePointWithTran(userId, changeData);
    //1. 포인트 변경 시도 성공 여부
    if (changePointResult.isSuccess) {
      const changePointCommitResult = await flexApiCaller.accountCaller.commitTran(changePointResult.sessionId);
      //2. 포인트 변경 Commit 성공 여부
      if (changePointCommitResult.isSuccess) {
        const userInfoResult = await flexApiCaller.accountCaller.getUserInfo(userId);
        //3. 사용자 정보 조회 성공 여부
        if (userInfoResult.isSuccess) {
          result.isSuccess = true;
          result.reason = null;
          result.userInfo = userInfoResult.userInfo;
        }
        else {
          //3. 사용자 재조회 실패한 경우..
        }
      }
      else {
        //2. 포인트 변경 Commit 실패한 경우..
      }
    }
    else {
      //1. 포인트 변경 시도 실패한 경우..
      await flexApiCaller.accountCaller.rollbackTran(changePointResult.sessionId);
    }
  }
  catch (err) {
    result.isSuccess = false;
    result.reason = 'Please contact the customer service center.';
    result.userInfo = null;
  }
  finally {
    res.send(result);
  }
});

module.exports = router;