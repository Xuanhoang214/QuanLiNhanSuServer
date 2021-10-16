const express = require('express')
const router = express.Router();
const {client} = require('./configdatabase');

router.get('/ToanBoPhongBan', async (req,res)=>{
    var _isCurrent = await client.db('QUANLYNHANSU').collection('IDSession').find({token:req.query.token}).count();

    if(_isCurrent > 0)
    {
        var _result = await client.db('QUANLYNHANSU').collection('PhongBan').find({}).toArray();

        res.send({success:true,data:_result})
    }else
    {
        res.send({success:false,mess:"Mã Xác Thực Không Tồn Tại !"})
    }
   
    
})
router.post('/ThemPhongBan', async (req,res)=>{
    var _isCurrent = await client.db('QUANLYNHANSU').collection('IDSession').find({token:req.query.token}).count();

    if(_isCurrent > 0)
    {
        var _result = await client.db('QUANLYNHANSU').collection('PhongBan').find({MaPB:req.body.MaPB}).count();
        if (_result > 0)
        {
            res.send({success:false,mess:'Phòng ban đã tồn tại'})
        }else
        {
            await client.db('QUANLYNHANSU').collection('PhongBan').insertOne(req.body);
            res.send({success:true,mess:'Thêm Thành Công'})
        }
    }else
    {
        res.send({success:false,mess:'Mã Xác Thực Không Tồn Tại !'})
    }


})
router.post('/CapNhatPhongBan',async (req,res)=>{

    var _isCurrent = await client.db('QUANLYNHANSU').collection('IDSession').find({token:req.query.token}).count();

    if(_isCurrent > 0)
    {
        var _result = await client.db('QUANLYNHANSU').collection('PhongBan').updateOne({"MaPB":req.body.MaPB},{$set:{"TenPB":req.body.TenPB}});
 
       if(_result.matchedCount == 0)
       {
         res.send({success:false,mess:'Phòng ban Không Tồn Tại'})
       }else
       {
        res.send({success:true,mess:'Cập Nhật Thành Công'})
       }
    }else
    {
        res.send({success:false,mess:"Mã Xác Thực Không Tồn Tại !"});
    }
   
    
 })
 
 router.delete('/XoaCongTrinh',async (req,res)=>{
    var _isCurrent = await client.db('QUANLYNHANSU').collection('IDSession').find({token:req.query.token}).count();
 
    if(_isCurrent > 0)
    {
       var _quanli = await client.db('QUANLYNHANSU').collection('PhongBan').find({SDT:req.body.SDT,Pass:req.body.Pass}).toArray();
       if(_quanli.length == 0)
       {
          res.send({success:false,mess:"Không Tìm Thấy Quản Lí Này !"});
       }else
       {
          if(_quanli[0].TypeNV !== 2  )
          {
             res.send({success:false,mess:"Bạn Không Có Quyền Xoá Phòng Ban!"});
          }else
          {
             var _result = await client.db('QUANLYNHANSU').collection('PhongBan').find({MaPB:req.body.MaPB}).count();
             if(_result == 1)
             {
                await client.db('QUANLYNHANSU').collection('PhongBan').deleteOne({MaPB:req.body.MaPB})
                res.send({success:true,mess:'Xóa Thành Công'})
             }else
             {
                res.send({success:false,mess:'Phòng Ban Không Tồn Tại'})
             }
          }
       }
 
 
    }else
    {
       res.send({success:false,mess:'Mã Xác Thực Không Tồn Tại'})
    }
    });

module.exports = router;