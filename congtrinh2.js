const express = require('express')
// Su Dung Doi Tuong Router Trong Express De Quy Dinh Phuong Thuc
/// Get - Post - Patch - Delete
const Encode = require('./encode/Encode');
const router = express.Router();

// Import MongoDB
const {client} = require('./configdatabase');


router.get('/ToanBoCongTrinh', async (req,res)=>{
    var _isCurrent = await client.db('QUANLYNHANSU').collection('IDSession').find({token:req.query.token}).count();

    if(_isCurrent > 0)
    {
      var _result = await client.db('QUANLYNHANSU').collection('CongTrinh2').find({}).toArray();
      res.send({success:true,data:_result})
    }else
    {
      res.send({success:false,mess:"Mã Xác Thực Không Tồn Tại !"})
    }

  
    
})

// Tương tự với get thì post + patch + delete tương tự như sau

router.post('/ThemCongTrinh',async (req,res)=>{
   // Encode.DecryptionCode("abkjbuguguc","123");
    // Kiem Tra Cong Trinh Da Co Chua 
    var _isCurrent = await client.db('QUANLYNHANSU').collection('IDSession').find({token:req.query.token}).count();

    req.body.MaCT = generateKey(6);
    if(_isCurrent > 0)
    {
      var _result = await client.db('QUANLYNHANSU').collection('CongTrinh2').find({TenCT:req.body.TenCT}).count();

      if(_result > 0)
      {
         res.send({success:false,mess:'Công Trình Đã Tồn Tại'})
      }else
      {
         await client.db('QUANLYNHANSU').collection('CongTrinh2').insertOne(req.body);
         res.send({success:true,mess:'Thêm Thành Công'})
      }
    }else
    {
      res.send({success:false,mess:"Mã Xác Thực Không Tồn Tại !"});
    }
    
})

// Update

router.post('/CapNhatCongTrinh',async (req,res)=>{

   var _isCurrent = await client.db('QUANLYNHANSU').collection('IDSession').find({token:req.query.token}).count();

      if(_isCurrent > 0)
      {
         var _result = await client.db('QUANLYNHANSU').collection('CongTrinh2').updateOne({MaCT:req.body.MaCT},{$set:
            {
               TenCT:req.body.TenCT,
               DiaDiem:req.body.DiaDiem,
               NgayCP:req.body.NgayCP,
               NgayKC:req.body.NgayKC, 
               NgayHT:req.body.NgayHT
            }});

         if(_result.matchedCount == 0)
         {
            res.send({success:false,mess:'Công Trình Không Tồn Tại'})
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
      var _quanli = await client.db('QUANLYNHANSU').collection('NhanVien2').find({SDT:req.body.SDT,Pass:req.body.Pass}).toArray();
      if(_quanli.length == 0)
      {
         res.send({success:false,mess:"Không Tìm Thấy Quản Lí Này !"});
      }else
      {
         if(_quanli[0].TypeNV !== 2  )
         {
            res.send({success:false,mess:"Bạn Không Có Quyền Xoá Công Trình !"});
         }else
         {
            var _result = await client.db('QUANLYNHANSU').collection('CongTrinh2').find({MaCT:req.body.MaCT}).count();
            if(_result == 1)
            {
               await client.db('QUANLYNHANSU').collection('CongTrinh2').deleteOne({MaCT:req.body.MaCT})
               res.send({success:true,mess:'Xóa Thành Công'})
            }else
            {
               res.send({success:false,mess:'Công Trình Không Tồn Tại'})
            }
         }
      }


   }else
   {
      res.send({success:false,mess:'Mã Xác Thực Không Tồn Tại'})
   }
   });


   function generateKey(length) {
      var ret = "";
      while (ret.length < length) {
        ret += Math.random().toString(16).substring(2);
      }
      return ret.substring(0,length);
    }
// public object để import được nó trong file khác.
// đây là câu lệnh xuất object
module.exports = router;
