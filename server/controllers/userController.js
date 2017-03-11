// 'use strict';

// module.exports = (io) => class User {
// 			constructor(id, username) {
// 			this.id = id;
// 			this.username = username;
// 			this.socketId = '';
// 			this.room = '';
// 			console.log("inside user",this.id,this.username);
// 		}

// 		sendMessage(message, cb) {
// 			io.sockets.connected[this.socketId].emit('privateMessage', message, () => {
// 				if (cb) {cb()};
// 			})
// 		}

// 		setSocketId(sId) {
// 			this.socketId = sId;
// 		}

// 		joinRoom(room, cb) {
// 			console.log("inside joinRoom::");
// 			this.room = room;
// 			io.sockets.connected[this.socketId].join(room);
// 			if (cb) {cb();}
// 		}
// 	}