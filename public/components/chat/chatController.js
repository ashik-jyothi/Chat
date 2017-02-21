angular.module('app')
.controller('chatController', ['$scope', '$document', 'Socket', 'Session', '$state', '$timeout', '$http', function($scope, $document, Socket, Session, $state, $timeout, $http) {
    
    $scope.user = Session.user.username;
    // $scope.room = Session.room;
    $scope.disconnect = function() {
        $http.get('/logout').then(function(res){
            $state.go('login')
            console.log("LOGGED OUT")});
        // window.location('/logout');
        // Socket.emit('logout', $scope.user, function() {
        //     console.log('Logout success')
        //     Session.clearUser(function() {
        //         $state.go('login', {});
        //     })
        // })
    }
    $scope.sendMessage = function(text) {

            var timestamp = moment().valueOf();
            var momentTime = moment.utc(timestamp);
            momentTime = momentTime.local().format('h:mm a');

        if (text && text.substr(0, 1) === '/') {
            var pm = {};
            pm.sender = $scope.user;
            pm.receiver = text.substr(1, text.indexOf(' '));
            pm.receiver = pm.receiver.trim();
            pm.type = 'private';
            pm.message = text.substring(text.indexOf(' '));
            pm.room = $scope.room;
            pm.time = momentTime;
            $scope.messageInput = "";
            console.log("client pm:",pm);
            Socket.emit("PrivateMsg", pm, function(response) {
                console.log("PrivateMsg response:" + response);
            });
        } else {

            var newMessage = {
                sender: $scope.user,
                receiver: 'All',
                type: 'group',
                message: text,
                room: $scope.room,
                time: momentTime
                
            }
            Socket.emit("chatMessage", newMessage, function(response) {
                if (response == 'success') {
                    $scope.messages.push(newMessage)
                    $scope.messageInput = "";
                    $timeout(() => {
                        var container = document.getElementById('messageContainer');
                        container.scrollTop = container.scrollHeight - container.clientHeight;
                    });
                }
            });
        }
    }
    $scope.getMessages = function() {
        Socket.emit('getMessages', {}, function(messages) {
            console.log('Messages:', messages)
            $scope.messages = messages;
            $timeout(() => {
                var container = document.getElementById('messageContainer');
                if (container) {
                    container.scrollTop = container.scrollHeight - container.clientHeight;
                }
            });
        })
    }
    $scope.getMessages();
    Socket.on('chatMessage', function(message) {
        $scope.messages.push(message);
        $timeout(() => {
            var container = document.getElementById('messageContainer');
            container.scrollTop = container.scrollHeight - container.clientHeight;
        });
    })

    $scope.toggleModal = function() {
        var modal = document.getElementById('myModal')
        modal.style.display = 'block';
        $document.on('click', function(e) {
            if (e.target == modal) {
                modal.style.display = 'none';
                $document.off('click');
            }
        })
    }
}])