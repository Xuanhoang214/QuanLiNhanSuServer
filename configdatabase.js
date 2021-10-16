const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://hoang:Hoang123456@cluster0.uqkid.gcp.mongodb.net/QUANLYNHANSU?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true ,useUnifiedTopology: true});

try
{
  var _promise = new Promise((resolve,reject)=>{
    client.connect();
    resolve();
  })
  _promise.then(()=>{
    console.log('Database Connected')
  })
 
}catch(e)
{
  console.log("cannot connect");
}finally
{
 // client.close();
}
module.exports = {client:client}