var CryptoJS = require('crypto-js');

//Giai ma string data gui tu client
const DecryptionCode=(string,key)=>{
    //string chuoi nhan duoc tu client
    //key key nhan duoc tu client 
    var result = CryptoJS.AES.decrypt(string,key);//ket qua ma hoa thuat toan AES utf8
    if(result==''){
        return false;
    } else {
        return result.toString(CryptoJS.enc.Utf8);
    }
}


module.exports = {DecryptionCode:DecryptionCode};