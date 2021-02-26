const express = require('express');
const app = express();

// console.log('HELLO APPLICATION STARTED');

// app.get('/',(req,res)=>{
//     res.send("HELLO SERVER STARTED");
// });

app.post('/',(req,res)=>{
    var email = req.body.email;
    var amount = req.body.amount;

    //Now to see whether we got the info

    res.send({"amount" : amount , "email" : email});
})

app.listen(8000,()=>{
    console.log('Server running on port 8000');
});