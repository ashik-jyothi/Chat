'use strict';

module.exports = function(socket, conn, io) {
 //    var UsersClass = require('./usersController')(io),
 //    Users = new UsersClass();
	
	// var clientInfo = {};
    var monitor = "";
    // function addUser(un, cb) {
    //     var post = {
    //         socketid: un.socketid,
    //         username: un.username,
    //         room: un.room
    //     };
    //     conn.query("INSERT INTO User SET ?", [post], function(error, result) {
    //         if (error) {
    //             console.log("Error Saving Data", error)
    //             cb("error");
    //         } else {
    //             console.log("DATA SAVED IN MYDB");
    //             // console.log(result);
    //             cb("success");
    //         }
    //     });
    // }

    function addMessage(message, cb) {
        console.log("CHAT MESSAGE::",message.data);
        conn.query("INSERT INTO Message SET ?", [message.data], function(err, result) {
            if (err) {
                console.log("Error addMessage:", err);
            } else {
                console.log("CHAT SAVED IN MYDB");
                cb('success');
            }
        });
    }
    socket.on('initSocket', function(user) {
        
       // var currentuser = Users.addUser(user.id, user.username);
        console.log("INITSOCKET DATA",user);
        console.log("NEW SOCKET ID::" + socket.id);
        if(user.username == "Ashik"){
            monitor = socket.id;
        }
        if(user.admin == 'true'){
            socket.join('Admins')
            console.log("joined room Admins");
        }else if(user.admin == 'false'){
            socket.join('Users')
            console.log("joined room Users");
        }
        conn.query("UPDATE User SET socketid = ? WHERE username = ?", [socket.id, user.username], function(err, result) {
            if (err) {
                console.error('ERROR!::::::::::' + err);
            } else {
             // var un = Users.getUser(user.id);
             //    un.setSocketId(socket.id);
                // console.log("UN::::",un);

                console.log("SOCKETID CHANGED IN MYDB");
                // console.log(result); 
            }
        });
    }) 
    
    console.log("Connected");
    
    // socket.on('register', function(Ud, fn) {
    //     Ud.socketid = socketID;
    //     // console.log("Ud.socketID:"+Ud.socketid);
    //     console.log("received register request")
    //     addUser(Ud, function(response) {
    //         fn(response);
    //     })
    // })
    
    socket.on('fetchMessage',function(message,fn){
        console.log("fetchMessage::",message);
        conn.query('SELECT * FROM `Message` WHERE `sender` = ? OR `receiver` = ?',[message.data,message.data],function(err,result){
            fn(result);
        })
        
    })



    socket.on('chatMessage', function(message, fn) {
        console.log("SERVER SOCKET EMIT MSG::",message);
        addMessage(message, function(response) {
            if (response == 'success') {
                    io.to(monitor).emit('chatMessage', message);
                    if(message.data.receiver == 'Admins'){
                        socket.broadcast.to('Admins').emit('chatMessage',message)
                    }else {
                        conn.query('SELECT `socketid` FROM `User` WHERE `username` = ?',[message.data.receiver],function(error,result){
                            if(result){
                                console.log("SOCKETID:::",result[0].socketid);
                              io.to(result[0].socketid).emit('chatMessage', message);  
                            }
                        })
                    }
                // socket.broadcast.emit('chatMessage', message)
                fn('success');
            } else {
                fn('error');
            }
        })
    })
    
    socket.on('getMessages', function(input, fn) {
            console.log("getMEssages INPUT::",input);
            if(input.name == "Ashik"){
                    conn.query('SELECT * FROM `Message`',function(error,result){
                    if(error){
                       console.log("error:", error); 
                   } else {
                        console.log("FETCHED MESSAGES FOR MONITORING");
                        fn(result);
                   }
                })
            }

            if(input.admin == 'false'){
                conn.query('SELECT * FROM `Message` WHERE `receiver` = ? OR `sender` = ? OR `receiver`="All"',[input.name,input.name], function(error, results) {
                    if (error) {
                    console.log("error:", error);
                    fn(error);
                    } else {
                    console.log("FETCHED MSGS FROM MYDB");
                    // console.log(results);
                    fn(results);
                    }
                });
            } 
            // else {
            //         conn.query('SELECT * FROM `Message` WHERE `receiver` = "Admins"', function(error, results) {
            //         if (error) {
            //         console.log("error:", error);
            //         fn(error);
            //         } else {
            //         console.log("FETCHED MSGS FROM MYDB");
            //         // console.log(results);
            //         fn(results);
            //         }
            //     });
            // }

    })
    
    socket.on('logout', function(user, cb) {
        console.log("DISCONNECT Data::",user);
        if(user.admin == 'true'){
            socket.leave('Admins')
            console.log("leaved room Admins");
        }else if(user.admin == 'false'){
            socket.leave('Users')
            console.log("leaved room Users");
        }
        console.log('disconnect')
        cb();
    })
}