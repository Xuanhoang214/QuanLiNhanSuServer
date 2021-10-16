const express = require('express')
const router = express.Router();
const {client} = require('./configdatabase');


router.get('/ToanBoNgayCong', async (req,res)=>{
     // Kiem Tra Token
     var _isCurrent = await client.db('QUANLYNHANSU').collection('IDSession').find({token:req.query.token}).count();
     if(_isCurrent > 0)
     {
        var _result = await client.db('QUANLYNHANSU').collection('NgayCong').find({}).toArray();
        res.send({success:true,data:_result});
     }else
     {
        res.send({success:false,mess:"Mã Xác Thực Không Tồn Tại !"});
     }
    
})

router.post('/ThemNgayCongCuaNhanVien', async (req,res)=>{

        var _isCurrent = await client.db('QUANLYNHANSU').collection('IDSession').find({token:req.query.token}).count();

        if(_isCurrent > 0)
        {           
               req.body.MaNC = generateKey(6);
               await client.db('QUANLYNHANSU').collection('NgayCong').insertOne(req.body);
               res.send({success:true,mess:"Thêm thành công",data:req.body})           
        }else
        {
                res.send({success:false,mess:"Mã Xác Thực Không Tồn Tại !"});
        }

    })


    router.post('/DanhGiaNhanVien', async (req,res)=>{
        // Kiem Tra Token
        var _isCurrent = await client.db('QUANLYNHANSU').collection('IDSession').find({token:req.query.token}).count();
        if(_isCurrent > 0)
        {
           var _result = await client.db('QUANLYNHANSU').collection('NgayCong').updateOne({MaNC:req.body.MaNC},{$set:{DanhGia:req.body.DanhGia,NhanXet:req.body.NhanXet}})
           .then(a=>{
            if(a.matchedCount > 0)
            {
                res.send({success:true,mess:"Đánh Giá Thành Công !"});
            }else
            {
                res.send({success:true,mess:"Không Tìm Thấy Nhân Viên Này !"});
            }
            
           }).catch(err=> {
            res.send({success:true,mess:"Hệ Thống Đang Lỗi, Vui Lòng Quay Lại Sau !"});
           })
           
           
        }else
        {
           res.send({success:false,mess:"Mã Xác Thực Không Tồn Tại !"});
        }
       
   })

   router.post('/DiemDanh', async (req,res)=>{
    // Kiem Tra Token
    var _isCurrent = await client.db('QUANLYNHANSU').collection('IDSession').find({token:req.query.token}).count();
    if(_isCurrent > 0)
    {
       var _result = await (await client.db('QUANLYNHANSU').collection('NgayCong').updateOne({MaNC:req.body.MaNC},{$set:{isDiemDanh:req.isDiemDanh}})).matchedCount;
       if(_result  > 0)
       {
        res.send({success:true,mess:"Điểm Danh Thành Công !"});
       }else
       {
        res.send({success:false,mess:"Điểm Danh Thất Bại !"})
       }
    }else
    {
       res.send({success:false,mess:"Mã Xác Thực Không Tồn Tại !"});
    }
   
})


router.post('/NgayCongNhanVien', async (req,res)=>{
    // Kiem Tra Token
    var _isCurrent = await client.db('QUANLYNHANSU').collection('IDSession').find({token:req.query.token}).count();
    if(_isCurrent > 0)
    {
       
       var _result = await client.db('QUANLYNHANSU').collection('NgayCong').find({MaNV:req.body.MaNV}).toArray();
       
       res.send({success:true,data:_result});
    }else
    {
       res.send({success:false,mess:"Mã Xác Thực Không Tồn Tại !"});
    }
   
});


router.post('/CapNhatNgayCong',async (req,res)=>{

        var _isCurrent = await client.db('QUANLYNHANSU').collection('IDSession').find({token:req.query.token}).count();

        if(_isCurrent > 0)
        {
            var _result = await client.db('QUANLYNHANSU').collection('NgayCong').updateOne({"MaNV":req.body.MaNV},{$set:{
               "HoTen":req.body.HoTen,
               "MaNV":req.body.MaNV,
               "TenCT":req.body.TenCT,
               "MaCT":req.body.MaCT, 
               "DateWorking":req.body.DateWorking

              }})
            .then(a=>{
                if(a.matchedCount > 0)
                {
                    res.send({success:true,mess:'Điểm Danh Thành Công !'})

                }else
                {
                    res.send({success:true,mess:'Không Tìm Thấy Nhân Viên Này !'})


                }
            }).catch(err=>
                {
                    res.send({success:false,mess:'Hệ Thống Đang Lỗi'})
                })
           
        }else
        {
            res.send({success:false,mess:"Mã Xác Thực Không Tồn Tại !"})
        }

        
    })

    router.delete('/XoaNgayCong',async (req,res)=>{
        var _isCurrent = await client.db('QUANLYNHANSU').collection('IDSession').find({token:req.query.token}).count();
     
        if(_isCurrent > 0)
        {
           var _quanli = await client.db('QUANLYNHANSU').collection('NhanVien').find({SDT:req.body.SDT,Pass:req.body.Pass}).toArray();
           if(_quanli.length === 0)
           {
              res.send({success:false,mess:"Không Tìm Thấy Quản Lí Này !"});
           }else
           {
              if(_quanli[0].TypeNV !== 2  )
              {
                 res.send({success:false,mess:"Bạn Không Có Quyền Xoá Ngày Công !"});
              }else
              {
                 var _result = await client.db('QUANLYNHANSU').collection('NgayCong').find({MaNV:req.body.MaNV}).count();
                 if(_result == 1)
                 {
                    await client.db('QUANLYNHANSU').collection('NgayCong').deleteOne({MaNV:req.body.MaNV})
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


function generateKey(length) {
    var ret = "";
    while (ret.length < length) {
      ret += Math.random().toString(16).substring(2);
    }
    return ret.substring(0,length);
  }

module.exports = router;