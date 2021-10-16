const express = require('express')
const router = express.Router();
const {client} = require('./configdatabase');
//xem toàn bộ nhân viên '

router.get('/ToanBoNhanVien', async (req,res)=>{
    var _isCurrent = await client.db('QUANLYNHANSU').collection('IDSession').find({token:req.query.token}).count();
        if(_isCurrent > 0)
    {
        var _result = await client.db('QUANLYNHANSU').collection('NhanVien').find({}).toArray();
        res.send({success:true,data:_result})
    }
        else
    {
        res.send({success:false,mess:"Mã Xác Thực Không Tồn Tại !"})
    }
})
// thêm nhân viên mới 
router.post('/ThemNhanVien', async (req,res)=>{
var _isCurrent = await client.db('QUANLYNHANSU').collection('IDSession').find({token:req.query.token}).count();
if(_isCurrent > 0)
{
var _result = await client.db('QUANLYNHANSU').collection('NhanVien').find({MaNV:req.body.MaNV}).count();
if (_result > 0)
{
    res.send({success:false,mess:'Nhân viên đã tồn tại'})
}else
{
    await client.db('QUANLYNHANSU').collection('NhanVien').insertOne(req.body);
    res.send({success:true,mess:'Thêm Thành Công'})
}
}
else
{
    res.send({success:false,mess:"Mã Xác Thực Không Tồn Tại !"})
}
})
//Cập nhật thông tin nhân viên

 //Xóa nhân viên 
 router.delete('/XoaNhanVien',async (req,res)=>{
    var _isCurrent = await client.db('QUANLYNHANSU').collection('IDSession').find({token:req.query.token}).count();
 
    if(_isCurrent > 0)
    {
       var _quanli = await client.db('QUANLYNHANSU').collection('NhanVien').find({SDT:req.body.SDT,Pass:req.body.Pass}).toArray();
       if(_quanli.length == 0)
       {
          res.send({success:false,mess:"Không Tìm Thấy Quản Lí Này !"});
       }else
       {
          if(_quanli[0].TypeNV !== 2  )
          {
             res.send({success:false,mess:"Bạn Không Có Quyền Xoá Nhân Viên!"});
          }else
          {
             var _result = await client.db('QUANLYNHANSU').collection('NhanVien').find({MaNV:req.body.MaNV}).count();
             if(_result == 1)
             {
                await client.db('QUANLYNHANSU').collection('NhanVien').deleteOne({MaNV:req.body.MaNV})
                res.send({success:true,mess:'Xóa Thành Công'})
             }else
             {
                res.send({success:false,mess:'Nhân Viên Không Tồn Tại'})
             }
          }
       }
 
 
    }else
    {
       res.send({success:false,mess:'Mã Xác Thực Không Tồn Tại'})
    }
    });

module.exports = router;