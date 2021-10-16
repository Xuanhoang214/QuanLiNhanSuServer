const express = require('express')
const router = express.Router();
const {client} = require('./configdatabase');
router.get('/ToanBoNhanVien', async (req,res)=>{
    var _result = await client.db('QUANLYNHANSU').collection('NhanVien').find({}).toArray();

    res.send({success:true,data:_result})
})
router.post('/ThemNhanVien', async (req,res)=>{
var _result = await client.db('QUANLYNHANSU').collection('NhanVien').find({MaNV:req.body.MaNV}).count();
if (_result > 0)
{
    res.send({success:false,mess:'Nhân viên đã tồn tại'})
}else
{
    await client.db('QUANLYNHANSU').collection('NhanVien').insertOne(req.body);
    res.send({success:true,mess:'Thêm Thành Công',MaNV:GenerateKey()})
}
})
router.post('/CapNhatNhanVien',async (req,res)=>{
   
    var _result = await client.db('QUANLYNHANSU').collection('NhanVien').updateOne({"MaNV":req.body.MaNV},{$set:{"HoTen":req.body.HoTen}});
 
       if(_result != null)
       {
          res.send({success:false,mess:'Nhân Viên Không Tồn Tại'})
       }else
       {
          res.send({success:true,mess:'Cập Nhật Thành Công',MaNV:GenerateKey()})
       }
 })
 
 router.delete('/XoaNhanVien',async (req,res)=>{
    var _result = await client.db('QUANLYNHANSU').collection('NhanVien').deleteOne({MaNV:req.body.MaNV})
    if(_result != null)
    {
       res.send({success:true,mess:'Xóa Thành Công',MaNV:GenerateKey()})
    }else
    {
       res.send({success:false,mess:'Nhân Viên Không Tồn Tại'})
    }
 })
function GenerateKey()
{
    return 1234;
}
module.exports = router;