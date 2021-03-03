//Lottery Manager : lotterymanager@app.com   password : manager1234
// User1 : first_user@app.com   pass : first1234

const express = require('express');
const app = express();
const bp = require('body-parser');   // For parsing the request body
const {save_user_information} = require('./models/server_db.js');
const path = require('path');
const publicPath = path.join(__dirname, './public');
var paypal = require('paypal-rest-sdk');

// console.log('HELLO APPLICATION STARTED');

// app.get('/',(req,res)=>{
//     res.send("HELLO SERVER STARTED");
// });

app.use(bp.json());
app.use(express.static(publicPath));

// To configure the paypal
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AURxAOWWPsPQ4Hb-p5r8iuyibz8jcYb3w9DAn6cFIuH2glf0d8wCiK42qkNfUgD9AD26Xt5IlvDXe0_U',
    'client_secret': 'EGpCo876AT2v0ldbfJBvr9d04X6Oj36_F2C-s9N4iVDvVry3adpz48vDaMPZKI_Pk4ZOkyCUhevrKG91'
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

    //Paypal
    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:8000/success",
            "cancel_url": "http://localhost:8000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Lottery",
                    "sku": "Funding",
                    "price": amount,
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": amount
            },
            "payee":{
                "email" : "lotterymanager@app.com"
            },
            "description": "Lottery Purchase"
        }]
    };
    
    
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            console.log("Create Payment Response");
            console.log(payment);

            for(var i = 0; i < payment.links.length; i++){
                if(payment.links[i].rel == 'approval_url'){
                    return res.send(payment.links[i].href);
                }
            }
        }
    });

    // res.send(result);

});


app.get('/success',  (req,res)=>{
   // res.send("In res");
    // const payerId = req.query.PayerID;
    // const paymentId = req.query.paymentID;
    // var execute_payment_json = {
    //     "payer_id" : payerId,
    //     "transactions" : [{
    //         "amount" : {
    //             "currency" : "USD",
    //             "total" : 100
    //         }
    //     }]
    // };

    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    var execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": 100
        }
    }]
  };





    paypal.payment.execute( paymentId,execute_payment_json,function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(payment);

        }
    });

    res.redirect('http://localhost:8000');
});

app.get('/get_total_amount', async (req,res)=>{
    var result = await get_total_amount();
    console.log(result);
    res.send(result);
});

app.listen(8000,()=>{
    console.log('Server running on port 8000');
});