var express = require('express');
var router = express.Router();
var fs = require('fs');
var product = require('../database/product');
var category = require('../database/category');


/* GET users listing. */
router.get('/', function(req, res, next) {

})

router.get('/category', function(req, res, next) {
  category.findAll()
  .then((result) => {
    res.send(result);
  });
});

router.get('/detail/:productId', function(req, res, next) {
  var productId = parseInt(req.params.productId);
  product.findByProductId(productId)
  .then((_result) => {
    res.send(_result);
  });
});

router.get('/:categoryId', function(req, res, next) {
  var categoryId = parseInt(req.params.categoryId);
  product.findByCategory(categoryId)
  .then((result) => {
    res.send(result);
  });
});

router.get('/image/:imageName', function(req, res, next) {
  var imageName = req.params.imageName;
  var url = "./images/" + imageName;

  fs.readFile(url, (err, data) => {
    if((err !== undefined && err !== null) || data === undefined || data === null){
      fs.readFile("./images/no-image.png", (err, data) => {
        if(err !== undefined && err !== null){
          console.log(err);
          return;
        }

        res.writeHead(200, { "context-type": "image/png" });
        res.write(data);
        res.end();
      })
    }
    else{
      res.writeHead(200, { "context-type": "image/jpeg" });
      res.write(data);
      res.end();
    }
  });
})

module.exports = router;