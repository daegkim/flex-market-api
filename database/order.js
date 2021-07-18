const mongoose = require('mongoose');
var tmp = []

//schema에 없어도 데이터는 가져오지만 조회가 안된다.
const orderSchema = new mongoose.Schema({
  orderId: {type: String, require: true, unique: true},
  orderProduct: {type: Array, require: true},
  userId: {type: String, require: true},
  orderDate: {type: Date, require: true}
}, { collection: "order" })

orderSchema.statics.createOrder = async function(productId) {
  const session = await mongoose.startSession();
  session.startTransaction();
  tmp.push({session: session, id: 1});
  return 1;
}

orderSchema.statics.commit = async function(sessionId) {
  await session.commitTransaction();
  tmp[0].session.endSession();
}

orderSchema.statics.rollback = async function(sessionId) {
  await session.abortTransaction();
  tmp[0].session.endSession();
}

module.exports = mongoose.model('order', orderSchema);