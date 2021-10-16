const express = require('express');
const router = express.Router();
const {storage} = require('./configgg');
const {client} = require('./configdatabase');
const bucket = storage.bucket('quanlinhansu');



router.post('/login',async (req,res)=>{
    
    var _result = await client.db('QUANLYNHANSU').collection('NhanVien').find({SDT:req.body.SDT,Pass:req.body.Pass}).count();
    if(_result > 0)
    {
        var _data = await client.db('QUANLYNHANSU').collection('NhanVien').find({SDT:req.body.SDT,Pass:req.body.Pass}).toArray();
        var _token  = generateKey(8);
        await client.db('QUANLYNHANSU').collection('IDSession').insertOne({token:_token});
        res.send({success:true,token:_token,data:_data[0]});
    }else
    {
        res.send({success:false,mess:"Tài Khoản Không Đúng, Vui Lòng Nhập Lại!"});
    }

});

router.get('/allNhanVien',async (req,res)=>{
    // Kiem Tra Token
    var _isCurrent = await client.db('QUANLYNHANSU').collection('IDSession').find({token:req.query.token}).count();

    if(_isCurrent > 0 )
    {
        var _result = await client.db('QUANLYNHANSU').collection('NhanVien').find({}).toArray();
        res.send({success:false,data:_result});
    }else
    {
        res.send({success:false,mess:"Mã Xác Thực Không Tồn Tại !"})
    }
})

// Cap Nhat 3 Thong Tin Bao Gom :
// NgaySinh , GioiTinh, Avatar
router.post('/CapNhatThongTin',async (req,res)=>{
    // Kiem Tra Token

    res.setHeader("Access-Control-Allow-Headers","*");
    res.setHeader("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept");

    var _isCurrent = await client.db('QUANLYNHANSU').collection('IDSession').find({token:req.query.token}).count();

    if(_isCurrent > 0 )
    {
        await client.db('QUANLYNHANSU').collection('NhanVien').updateOne({MaNV:req.body.MaNV},
            {$set:
            {
                HoTen:req.body.HoTen,
                DiaChi:req.body.DiaChi,
                MaPB:req.body.MaPB,
                BaoHiem:req.body.BaoHiem,
                LuongCoBan:req.body.LuongCoBan,
                NgaySinh:req.body.NgaySinh,
                GioiTinh:req.body.GioiTinh,
                Avatar:req.body.Avatar,
                Pass:req.body.Pass,
                SDT:req.body.SDT,
                MaCV:req.body.MaCV,
                CMND: req.body.CMND,
                ImageCMND: req.body.ImageCMND
            }})
        .then(value =>
            {
                if(value.matchedCount > 0)
                {
                    res.send({success:true,data:req.body})
                }else
                {
                    res.send({success:false,mess:"Mã Nhân Viên Không Tồn Tại !"});
                }
                
                }
                
            ).catch(e => res.send({success:false,mess:e+""}));
        
    }else
    {
        res.send({success:false,mess:"Mã Xác Thực Không Tồn Tại !"})
    }
})
router.post('/create', async (req,res)=>{
    // Mật Khẩu Mặc Định
    req.body.Pass = "123456";
    req.body.Avatar = "Chưa Có";
    req.body.NgaySinh = "Chưa Có";
    req.body.GioiTinh = "Chưa Có";
    req.body.DiaChi = "Chưa Có";
    req.body.MaPB = "Chưa Có";
    req.body.MaCV = "NV001";
    req.body.TypeNV = 1;
    req.body.BaoHiem = 0;
    req.body.LuongCoBan = 0;
    req.body.MaNV = generateKey(6);
    req.body.CMND = "Chưa Có";
    req.body.ImageCMND = "Chưa Có";
    // Kiểm Tra SDT 

    var _account = await client.db('QUANLYNHANSU').collection('NhanVien').find({SDT:req.body.SDT}).count();
    if(_account > 0)
    {
        res.send({success:false,mess:"Tài Khoản Đã Tồn Tại !"});
        return;
    }
    var _result = await client.db('QUANLYNHANSU').collection('NhanVien').insertOne(req.body);
    if(_result != undefined)
    {
        var _token  = generateKey(8);
        await client.db('QUANLYNHANSU').collection('IDSession').insertOne({token:_token});
        res.send({success:true,data:req.body,token:_token});
    }
})

   
router.post('/UploadAvatar',async(req,res)=>{

    try{
        var _isCurrent = await client.db('QUANLYNHANSU').collection('IDSession').find({token:req.query.token}).count();
        if(_isCurrent > 0)
        {
            if(req.body.filename !== undefined)
            {
                await uploadImage(req.file).then(val=>{
                    res.send({success:true,data:val})
    
                });
            }else
            {
                res.send({success:false,image:'Vui Lòng Truyền Vào filename'})
            }
    
        }else
        {
            res.send({success:false,mess:"Mã Xác Thực Không Tồn Tại !"})
        }
    }catch(e)
    {
        res.send({success:false,mess:e})
    }

})
const uploadImage = (file) => new Promise((resolve, reject) => {
    const { originalname, buffer } = file
  
    const blob = bucket.file(originalname.replace(/ /g, "_"))
    const blobStream = blob.createWriteStream({
      resumable: false
    })
    blobStream.on('finish',async (val) => {
       await bucket.file(file.originalname).makePublic();
      const publicUrl = 
        `https://storage.googleapis.com/${bucket.name}/${file.originalname}`
      
      resolve(publicUrl)
    })
    .on('error', () => {
      reject(`Unable to upload image, something went wrong`)
    })
    .end(buffer)
  })
  


function generateKey(length) {
    var ret = "";
    while (ret.length < length) {
      ret += Math.random().toString(16).substring(2);
    }
    return ret.substring(0,length);
  }


module.exports = router;