var express = require('express');
var request = require('request-promise-native');
var router = express.Router();
var order = require('../database/order');
const axios = require('axios');

router.get('/test', async function(req, res, next){
  var option = {
    uri: 'http://localhost:4000/product/category'
  }

  var result = await request.get(option);
  console.log(result);
});

router.post('/new_order', async function(req, res, next) {
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