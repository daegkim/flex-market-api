var mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryId: {type: Number, require: true, unique: true},
  categoryName: {type: String, require: true},
}, { collection: "category" })

categorySchema.statics.findAll = function() {
  return this.find({});
}

module.exports = mongoose.model('category', categorySchema);