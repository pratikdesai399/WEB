var mysql = require('mysql');
var db_config = {
    host : '127.0.0.1',
    user : 'root',
    password : 'Palya2000*',
    database : 'webapp'

}

var connection;

function handleDisconnect(){
    connection = mysql.createConnection(db_config);

    connection.connect(function(err){
        if (err){
            console.log("Error", err);
            setTimeout(handleDisconnect, 2000);
        }
        // console.log("Connected");
    });

    connection.on('error', function(err){
        if(err.code = 'PROTOCOL_CONNECTION_LOST'){
            handleDisconnect();
        }else{
            throw err;
        }
    })
}

handleDisconnect();

module.exports = connection;