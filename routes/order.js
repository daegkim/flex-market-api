var express = require('express');
var request = require('request-promise-native');
var router = express.Router();
var order = require('../database/order');

router.get('/test', async function(req, res, next){
  var option = {
    uri: 'http://localhost:4000/product/category'
  }

  var result = await request.get(option);
  console.log(result);
});

router.post('/newOrder', async function(req, res, next) {
  //분산 트랜잭션을 구현해야 함. 아래 3가지 행동을 하나의 트랜잭션으로 묶을 수 있어야 한다.
  //만약 1번 성공하고 2번을 실패했을 경우, 1번 트랜잭션을 다시 원상복구 시켜야 한다.
  //만약 1번, 2번을 성공하고 3번을 실패했을 경우, 1번, 2번 트랜잭션을 다시 원상복구 시켜야 한다.
  //주문을 새로 생성
  //제품의 수량을 수정
  //회원의 포인트 차감
  var userId = req.body.userId;
  var orderProduct = req.body.orderProduct;
  order.createOrder('hello')
  .then((res) => {console.log(res); order.commit(res);})
})

module.exports = router;