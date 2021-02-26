const express = require('express');
const app = express();
const bp = require('body-parser');   // For parsing the request body

// console.log('HELLO APPLICATION STARTED');

// app.get('/',(req,res)=>{
//     res.send("HELLO SERVER STARTED");
// });

app.use(bp.json());

app.post('/',(req,res)=>{
    var email = req.body.email;
    var amount = req.body.amount;

    //Validation

    if(amount <= 1){
        request_info = {};
        request_info.error = true;
        request_info.message = "The amount should be greater than 1";

        return (res.send(request_info));
    }

    //Now to see whether we got the info

    res.send({"amount" : amount , "email" : email});

})

app.listen(8000,()=>{
    console.log('Server running on port 8000');
});