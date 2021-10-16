sau khi clone chạy lệnh : npm install 
Đọc file index .
Chạy project với câu lệnh : node index.
Sau khi chạy thành công terminal sẽ báo : Connected
Vào postman , chọn phương thức GET và điền URL sau để test
localhost:3000/baohiem/ToanBoBaoHiem
// Nếu trả về
{
    "success": true
}
thì API chạy đúng .


run server npm start

#flow giao tiep client va server 
client send pass and account => server check true => send passport to client
client sau khi co duoc passport => call api tu server dung phuong thuc post gui passport len server de check => check passport hop le thi chap nhan request 
client thoat => client gui request huy passsport len server . de server huy passport

moi du lieu duoc gui tu client den server hoac nguoc lai deu duoc ma hoa bang thuat toan AES o server dung passport duoc gui len de doc du lieu bang function DecryptionCode trong file encode.js