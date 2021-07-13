mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/flex', {useNewUrlParser: true, useUnifiedTopology: true, retryWrites: false})
.then(() => {console.log('mongo connected')})
.catch((reason) => {console.log(reason);})

const connectMongo = function() {
  mongoose.Promise = global.Promise;
  mongoose.connect("mongodb://localhost:27017/flex", {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {console.log("mongo connected")})
  .catch((reason) => {console.log(reason);});
}

const getProductsByCategory = function() {
  
}