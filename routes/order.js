var express = require('express');
var request = require('request-promise-native');
var router = express.Router();
var order = require('../database/order');
const axios = require('axios');
const apiCallOption = require('../api-call-option');
const { accountApi, orderApi } = require('../api-call-option');

/**
 * 
 * @param {string} userId 
 * @param {{point: number}} changeData 
 * @returns
 */
const changePointPost = async function (userId, changeData) {
  const result = {
    isSuccess: false,
    reason: 'Please contact the customer service center.',
    sessionId: -1
  }

  try {
    const callOptions = apiCallOption.accountApi.changePoint(userId, changeData);
    const changeAccountData = await axios(callOptions).data;
    result.sessionId = changeAccountData.sessionId;
    result.isSuccess = changeAccountData.isSuccess;
    result.reason = changeAccountData.reason;
  }
  catch (err) {
    result.isSuccess = false;
    result.reason = 'Please contact the customer service center.';
  }
  finally {
    return result;
  }
}

/**
 * 
 * @param {string} userId 
 * @param {{productId: number, pricePerPiece: number, quantity: number}} orderProduct 
 * @returns 
 */
const createOrderPost = async function (userId, orderProduct) {
  const result = {
    isSuccess: false,
    reason: 'Please contact the customer service center.',
    sessionId: -1
  }

  try {
    const callOptions = apiCallOption.orderApi.createOrder(userId, orderProduct);
    const createOrderData = await axios(callOptions).data;
    result.sessionId = createOrderData.sessionId;
    result.isSuccess = createOrderData.isSuccess;
    result.reason = createOrderData.reason;
  }
  catch (err) {
    result.isSuccess = false;
    result.reason = 'Please contact the customer service center.';
  }
  finally {
    return result;
  }
}

const makeNewOrder = async (_userId, _orderProduct) => {
  var price = 0;
  for(var product of _orderProduct){
    price = product.pricePerPiece * product.quantity;
  }
  const changeData = {
    price: price * -1
  }

  //두 트랜잭션을 모두 실행시킴
  var resultChangePoint = await changePointPost(_userId, changeData);
  var resultCreateOrder = await createOrderPost(_userId, _orderProduct);

  //둘 다 성공했기 때문에 커밋
  //문제는.. 첫번째는 커밋시켜서 성공헀는데.. 두번째가 커밋시켰는데 실패하면..? 첫번째를 롤백해야 함. 하지만 불가능함..
  //만약 이것까지 생각하려면.. 커밋전에 이전 값을 저장해두고 롤백명령을 하면 이전 값으로 가지고 와야 하는데 이러다가 또 문제 생기면..?
  if(resultChangePoint.isSuccess && resultCreateOrder.isSuccess){
    var resultAccountCommit = await accountApi.commit(_userId, resultChangePoint.sessionId);
    if(resultAccountCommit.isSuccess){

    }
    else{
      //둘다 원복
    }
    var resultOrderCommit = await orderApi.commit(_userId, resultCreateOrder.sessionId);
    if(resultOrderCommit.isSuccess){

    }
    else{
      //사실상 accountApi는 이미 커밋이 되었기 때문에 롤백될 수 없음
      //accountApi도 롤백하려면 변경사항 테이블이 있으니 그 테이블 값을 가지고 원복시켜야 함.
      //그런데 만약 원복시키는 과정에서 또 에러가 난다면...?
      //무한 반복.. 과연 기업에서는 이럴 경우에 어떻게 해결하는지, 분산 트랜잭션은 어떻게 해결하는지? 이래서 gateapi -> accountapi -> orderapi로 각자가 호출하도록 되는건지..
      await accountApi.rollback(_userId, resultChangePoint.sessionId);
      await orderApi.rollback(_userId, resultCreateOrder.sessionId);
    }
  }
  else{
    await accountApi.rollback(_userId, resultChangePoint.sessionId);
    await orderApi.rollback(_userId, resultCreateOrder.sessionId);
  }
}

router.get('/test', async function(req, res, next){
  var option = {
    uri: 'http://localhost:4000/product/category'
  }

  var result = await request.get(option);
  console.log(result);
});

router.post('/new_order', async function(req, res, next) {
  console.log(req.body.orderProduct)
  res.send({isSuccess: false, reason: 'test'});
  return;
  const userId = req.body.userId;
  const orderProduct = req.body.orderProduct;
  //changeData
  var price = 0;
  for(var product of orderProduct){
    price = product.pricePerPiece * product.quantity;
  }
  const changeData = {
    price: price * -1
  }

  //두 트랜잭션을 모두 실행시킴
  var resultChangePoint = await axios({
    method: 'post',
    url: 'http://localhost:3100/change_point',
    data: {
      userId: userId,
      changeData: changeData
    }
  });

  var resultCreateOrder = await axios({
    method: 'post',
    url: 'http://localhost:3200/create_order',
    data: {
      userId: userId,
      orderProduct: orderProduct
    }
  });

  //둘 다 성공했으면 둘 다 커밋
  //둘 중 하나라도 실패했으면 둘 다 롤백
  if(resultChangePoint.data.isSuccess && resultCreateOrder.data.isSuccess){
    await axios({
      method: 'post',
      url: 'http://localhost:3100/commit_session',
      data: {
        sessionId: resultChangePoint.data.sessionId
      }
    });
  
    await axios({
      method: 'post',
      url: 'http://localhost:3200/commit_session',
      data: {
        sessionId: resultCreateOrder.data.sessionId
      }
    });
    res.send(true);
  }
  else{
    await axios({
      method: 'post',
      url: 'http://localhost:3100/rollback_session',
      data: {
        sessionId: sessionId
      }
    });
  
    await axios({
      method: 'post',
      url: 'http://localhost:3200/rollback_session',
      data: {
        sessionId: resultCreateOrder.data.sessionId
      }
    });
  }
})

module.exports = router;