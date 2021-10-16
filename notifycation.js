const express = require('express')
const router = express.Router();
const {client} = require('./configdatabase');
const { raw } = require('express');


router.get('/DanhSachThongBao',async (req,res)=>{

    var _isCurrent = await client.db('QUANLYNHANSU').collection('IDSession').find({token:req.query.token}).count();
    if(_isCurrent > 0)
    {
        var _result = await client.db('QUANLYNHANSU').collection('Notifycation').find({}).toArray();
        res.send({success:true,data:_result});
    }else
    {   
        res.send({success:false,mess:"Mã Xác Thực Không Tồn Tại !"});
    }

});


router.post('/ThemThongBao',async (req,res)=>{

    var _isCurrent = await client.db('QUANLYNHANSU').collection('IDSession').find({token:req.query.token}).count();
    if(_isCurrent > 0)
    {
        var _result = await (await client.db('QUANLYNHANSU').collection('Notifycation').insertOne(req.body)).insertedCount;
        if(_result > 0)
        {
            res.send({success:true,mess:"Thêm Thành Công !"});
        }
       
    }else
    {   
        res.send({success:false,mess:"Mã Xác Thực Không Tồn Tại !"});
    }

});


module.exports = router;