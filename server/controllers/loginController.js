'use strict';

module.exports = function(socket, conn, io) {
	socket.on('isAdmin', function(user,cb) {
		console.log("SERVER isAdmin",user);
		conn.query('SELECT * FROM `User` WHERE `username` = ?',[user.data],function(err,result){
			if(result[0].admin == 'true'){
				cb(1)
			}else{
				cb(0);
			}
		})
		
	});
};