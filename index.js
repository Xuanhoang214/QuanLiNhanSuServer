const express = require('express')
var app = express();
var cors = require('cors');
const bodyParser = require('body-parser')
const multer = require('multer')
// Import MongoDB
const {client} = require('./configdatabase').client;
const congtrinh = require('./congtrinh');

const truongphong = require('./truongphong');
const phongban = require('./phongban');
const ngaycong = require('./ngaycong');
const { request } = require('express');
const account = require('./account');
const notifycation = require('./notifycation');
const bangluong = require('./bangluong');

const bangluong2 = require('./bangluong2');
const account2 = require('./account2');
const ngaycong2 = require('./ngaycong2');
const congtrinh2 = require('./congtrinh2');




const multerMid = multer({
    storage: multer.memoryStorage(),
    limits: {
      // no larger than 5mb.
      fileSize: 5 * 1024 * 1024,
    },
  })

app.use(bodyParser.json())
app.use(multerMid.single('image'));
app.use(bodyParser.urlencoded({extended: false}))

//User Cors
app.use(cors());

// localhost:3000/baohiem/abc
// abc ở đây sẽ được quy định trong file baohiem.js
//app.use('/passport',passport);
app.use('/congtrinh',congtrinh);
app.use('/truongphong', truongphong);
app.use('/truongphong/phongban', phongban);
app.use('/ngaycong', ngaycong);
app.use('/account',account);
app.use('/notifycation',notifycation);
app.use('/bangluong',bangluong);

app.use('/ngaycong2', ngaycong2);
app.use('/bangluong2',bangluong2);
app.use('/congtrinh2',congtrinh2);
app.use('/account2',account2);

// Do Nhieu Tac Vu Khac Nhau Nen Minh Tach 1 Tac Vu Thanh 1 file.
// O Day co 3 File 

// Nếu không khai báo cổng thì khi chạy server sẽ chọn 1 cổng bất kỳ và tuỳ biến
// Điều này làm cho dự án mất kiểm soát
// và khi đưa lên dịch vụ điện toán để chạy thì setting rất cực
// Để tránh lỗi thì ta thường thiết lập 1 port có số cao trên 2000.
// 2 port dc dùng phổ biến là 3000 và 8008
// 1 số port là mặc định của 1 số phương thức kết nối 
// VD : 88 là của SSH hoặc 443 là của TCP

// Lăng nghe port 5000
//app.listen(3000);
app.listen(process.env.PORT||3000 , function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
