var mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: {type: Number, require: true, unique: true},
  productName: {type: String, require: true},
  price: {type: Number, require: true},
  quantity: {type: Number, require: true},
  image: {type:String, require: true},
  categoryId: {type: Number, require: true},
  eventId: {type: Number, require: true}
}, { collection: "product" })

productSchema.statics.findByCategory = function(categoryId) {
  return this.find({categoryId: categoryId});
}

productSchema.statics.findByProductId = function(productId) {
  return this.findOne({productId: productId});
}

module.exports = mongoose.model('product', productSchema);