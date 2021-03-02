const express = require('express');
const app = express();
const bp = require('body-parser');   // For parsing the request body
const {save_user_information} = require('./models/server_db.js');
const path = require('path');
const publicPath = path.join(__dirname, './public');
const paypal = require('paypal-rest-apk');

// console.log('HELLO APPLICATION STARTED');

// app.get('/',(req,res)=>{
//     res.send("HELLO SERVER STARTED");
// });

app.use(bp.json());
app.use(express.static(publicPath));

// To configure the paypal
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AQ7aCV5SUS9hRMMVPQCiBQ-7CKcBoAf0gKUvmEHlKcHoIlR2FBE987l8GkTxy7fTfAIvB8B6n44nmfcZ',
    'client_secret': 'EBQQYXfbq_Qfobj0wUikO9DDQmQRM3XaNeQhKW3MsCSnIIXu2bI2RrJY9WKHMom1SUhzJT1FmJh2tBJR'
  });

app.post('/post_info', async (req,res)=>{
    var email = req.body.email;
    var amount = req.body.amount;

    //Validation

    if(amount <= 1){
        request_info = {};
        request_info.error = true;
        request_info.message = "The amount should be greater than 1";

        return (res.send(request_info));
    }
    var result = await save_user_information({"amount" : amount , "email" : email});

    //Now to see whether we got the info

    res.send(result);

});

app.get('/get_total_amount', async (req,res)=>{
    var result = await get_total_amount();
    console.log(result);
    res.send(result);
});

app.listen(8000,()=>{
    console.log('Server running on port 8000');
});