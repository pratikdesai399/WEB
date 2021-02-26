const express = require('express');
const app = express();

// console.log('HELLO APPLICATION STARTED');

app.get('/',(req,res)=>{
    res.send("HELLO SERVER STARTED");
});

app.listen(8000,()=>{
    console.log('Server running on port 8000');
});