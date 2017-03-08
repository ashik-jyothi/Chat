'use strict';

module.exports = function(socket, conn, io) {


    socket.on('getUsers',function(e,fn){
             conn.query('SELECT username FROM `User` WHERE `admin` = "false"', function(error, results) {
            if (error) {
                console.log("error:", error);
            } else {
                console.log("FETCHED USERS FROM MYDB");
                // console.log(results);
                fn(results);
            }
        });       
    })

};