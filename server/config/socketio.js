'use strict';

var socketio = require('socket.io');

module.exports = function(server, mysql) {
	var io = socketio.listen(server);

	io.on('connection', function(socket) {
		require('../controllers/adminController.js')(socket,mysql,io);
		require('../controllers/chatController')(socket, mysql, io);
		require('../controllers/userController')(io);
	})
}