angular.module('app')
.controller('adminController', ['$scope', '$document', 'Socket', 'Session', '$state', '$timeout', '$http', function($scope, $document, Socket, Session, $state, $timeout, $http) {

        $scope.users = ['ed','john','david'];
    $scope.msg_wrap = false;
    $scope.chat_boxClick = false;
    $scope.msg_boxClick = false;
    $scope.chatbox = function(user){
        $scope.clickedUser = user;
        $scope.msg_boxClick = !$scope.msg_boxClick;
        $scope.msg_wrap = true;
    }

    console.log("INSIDE adminController");
    $scope.user = Session.user.username;

    $scope.options = ["ed","john","david"]
    
    $scope.disconnect = function() {
        $http.get('/logout').then(function(res){
            $state.go('login')
            console.log("LOGGED OUT")});}

    $scope.sendMessage = function(text) {
            var timestamp = moment().valueOf();
            var momentTime = moment.utc(timestamp);
            momentTime = momentTime.local().format('h:mm a');

            if(!angular.isUndefined(text)) {
                console.log(text);
            var newMessage = {
                sender: $scope.user,
                receiver: 'All',
                message: text,
                time: momentTime
                }
            Socket.emit("chatMessage", newMessage, function(response) {
                console.log("EMITTING DATA MSG::",newMessage);
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
        console.log("INCOMING MSG",message);
        $scope.messages.push(message.data);
        $timeout(() => {
            var container = document.getElementById('messageContainer');
            container.scrollTop = container.scrollHeight - container.clientHeight;
        });
    })

    Socket.emit("getUsers", {}, function(res) {
        console.log("getUsers");
        console.log(res);
        $scope.users = res;
    })
}]);