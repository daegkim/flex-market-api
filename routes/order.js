const express = require('express');
const router = express.Router();
const flexApiCaller = require('../flex-api-caller/flex-api-caller');

router.post('/new_order', async function (req, res, next) {
  const result = {
    isSuccess: false,
    reason: 'Please contact the customer service center.',
    userInfo: null,
    orders: null
  }

  try {
    const userId = req.body.userId;
    const orderProduct = req.body.orderProduct;
    //changeData
    var point = 0;
    for (var product of orderProduct) {
      point = product.pricePerPiece * product.quantity;
    }
    const changeData = {
      point: point * -1
    }

    //두 트랜잭션을 모두 실행시킴
    const createOrderResult = await flexApiCaller.orderCaller.createOrderWithTran(userId, orderProduct);
    const changePointResult = await flexApiCaller.accountCaller.changePointWithTran(userId, changeData);

    //1. 둘 다 성공 여부
    if (createOrderResult.isSuccess && changePointResult.isSuccess) {
      const createOrderCommitResult = await flexApiCaller.orderCaller.commitTran(createOrderResult.sessionId);
      const changePointCommitResult = await flexApiCaller.accountCaller.commitTran(changePointResult.sessionId);
      //2. 둘 다 커밋 요청 성공 여부
      if (createOrderCommitResult.isSuccess && changePointCommitResult.isSuccess) {
        const getUserInfoResult = await flexApiCaller.accountCaller.getUserInfo(userId);
        const getOrdersResult = await flexApiCaller.orderCaller.getOrders(userId);
        //3. 사용자 정보와 주문이력 조회 성공 여부
        if (getUserInfoResult.isSuccess && getOrdersResult.isSuccess) {
          result.isSuccess = true;
          result.reason = null;
          result.userInfo = getUserInfoResult.userInfo;
          result.orders = getOrdersResult.orders;
        }
        else{
          //3. 사용자 정보 혹은 주문이력 조회 성공 못한 경우...
        }
      }
      else {
        //2. 둘 중 하나라도 커밋 성공 못한 경우...
        await flexApiCaller.orderCaller.rollback(createOrderResult.sessionId);
        await flexApiCaller.accountCaller.rollbackTran(changePointResult.sessionId);
      }
    }
    else{
      //1. 둘 중 하나라도 성공 못해서 롤백
      await flexApiCaller.orderCaller.rollback(createOrderResult.sessionId);
      await flexApiCaller.accountCaller.rollbackTran(changePointResult.sessionId);
    }
  }
  catch (err) {

  }
  finally {
    res.send(result);
  }
})

module.exports = router;