const mongoose = require('mongoose');
const crypto = require('crypto');
const { error } = require('console');

const accountChangeHistSchema = new mongoose.Schema({
  userId: {type: String, require: true},
  actId: {type: String, require: true},
  prevData: {type: Object, require: true},
  changeData: {type: Object, require: true},
  changeDate: {type: Date, require: true}
}, { collection: "accountChangeHist", versionKey: false});

accountChangeHistSchema.statics.createHist = function(userId, prevData, changeData, actId) {
  return this.create({
    userId: userId,
    actId: actId,
    prevData: prevData,
    changeData: changeData,
    changeDate: new Date()
  });
}

module.exports = mongoose.model('accountChangeHist', accountChangeHistSchema);