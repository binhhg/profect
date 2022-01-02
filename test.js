const express = require('express');
const QRCode = require('qrcode');
const app = express();

app.get('/',async(req,res)=>{
    let img='';
    let qr= await QRCode.toDataURL('I am Cuamotcang!');
    console.log(qr);
    img = `<image src= " `+qr+ `" />`
    return res.send(img);
});

app.listen(3000, ()=>{
    console.log("app is running at port 3000")
})
