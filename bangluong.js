const express = require('express')
// Su Dung Doi Tuong Router Trong Express De Quy Dinh Phuong Thuc
/// Get - Post - Patch - Delete
const Encode = require('./encode/Encode');
const router = express.Router();

// Import MongoDB
const {client} = require('./configdatabase');

router.get('/DanhSachBangLuong',async (req,res)=>
{
    var _isCurrent = await client.db('QUANLYNHANSU').collection('IDSession').find({token:req.query.token}).count();

    if(_isCurrent > 0)
    {
      var _result = await client.db('QUANLYNHANSU').collection('BangLuong').find({}).toArray();
      res.send({success:true,data:_result})
    }else
    {
      res.send({success:false,mess:"Mã Xác Thực Không Tồn Tại !"})
    }
});


router.post('/LayBangLuong',async (req,res)=>
{
    var _isCurrent = await client.db('QUANLYNHANSU').collection('IDSession').find({token:req.query.token}).count();

    if(_isCurrent > 0)
    {
      var _result = await client.db('QUANLYNHANSU').collection('BangLuong').find({MaNV:req.body.MaNV}).toArray();
      res.send({success:true,data:_result})
    }else
    {
      res.send({success:false,mess:"Mã Xác Thực Không Tồn Tại !"})
    }   
});



router.post('/ThemBangLuong',async (req,res)=>
{
    var _isCurrent = await client.db('QUANLYNHANSU').collection('IDSession').find({token:req.query.token}).count();

    if(_isCurrent > 0)
    {
      var _result = await (await client.db('QUANLYNHANSU').collection('BangLuong').insertOne(req.body)).insertedCount;
      if(_result > 0)
          res.send({success:true,data:_result})
    }else
    {
      res.send({success:false,mess:"Mã Xác Thực Không Tồn Tại !"})
    }   
});





module.exports = router;