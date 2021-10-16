const express = require('express')
const router = express.Router();
const {client} = require('./configdatabase');

router.post('/CapNhatNhanVien',async (req,res)=>{
   
    var _result = await client.db('QUANLYNHANSU').collection('NhanVien2').updateOne({"MaNV":req.body.MaNV},{$set:{"HoTen":req.body.HoTen}});
 
       if(_result != null)
       {
         res.send({success:true,mess:'Cập Nhật Thành Công',MaNV:GenerateKey()})
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