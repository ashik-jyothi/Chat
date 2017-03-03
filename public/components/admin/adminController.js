angular.module('app')
.controller('adminController', ['$scope', '$document', 'Socket', 'Session', '$state', '$timeout', '$http', function($scope, $document, Socket, Session, $state, $timeout, $http) {

    /*=============================
    =            popup            =
    =============================*/
    $scope.onlineUsers = ['ed','john','david','test','joe'];
    $scope.userObj = {};
    $scope.selectedCount = 0;
    $scope.onlineUsers.forEach(function(x){
        $scope.userObj[x] = {
            selected: false
        }
    })
    console.log("USEROBJ",$scope.userObj);
    $scope.msg_wrap = false;
    $scope.chat_boxClick = false;
    $scope.msg_boxClick = false;
    $scope.chatbox = function(user){
        if($scope.selectedCount < 2){
            $scope.clickedUser = user;
            $scope.msg_boxClick = true;
            $scope.msg_wrap = true;
        }

        console.log("SELECTED USERS:::",$scope.selectedCount);
    }
    
    $scope.selectiontick = function(user){
        if($scope.userObj[user].selected){
            $scope.userObj[user].selected = false;
            $scope.selectedCount -= 1;
        }else {
            $scope.userObj[user].selected = true;
            $scope.selectedCount += 1;
        }

        if($scope.selectedCount > 1){
            $scope.clickedUser = $scope.selectedCount + " Selected";
            $scope.msg_boxClick = true;
        }else {
            $scope.clickedUser = user;
            $scope.msg_boxClick = !$scope.msg_boxClick;
        }
        console.log($scope.userObj);

    }

    $scope.selectall = function(){
        for(prop in $scope.userObj){
            $scope.userObj[prop].selected = true;
            console.log("HERE");
        }
        $scope.selectedCount = Object.keys($scope.userObj).length;
        $scope.clickedUser = $scope.selectedCount + " Selected";
        $scope.msg_boxClick = true;
        $scope.msg_wrap = true;
        console.log("SELECTEDCOUNT",$scope.selectedCount,$scope.userObj);
    }
    $scope.selectnone = function(){
        for(prop in $scope.userObj){
            $scope.userObj[prop].selected = false;
            console.log("HERE2  ");
        }
        $scope.selectedCount = 0;
        $scope.msg_boxClick = false;
        $scope.msg_wrap = false;
        console.log("SELECTEDCOUNT",$scope.selectedCount,$scope.userObj);
    }
    
    
    /*=====  End of popup  ======*/
    



    // $scope.onlineUsers = ['ed','john','david'];
    // $scope.msg_wrap = false;
    // $scope.chat_boxClick = false;
    // $scope.msg_boxClick = false;

    // $scope.chatbox = function(user){
    //     $scope.clickedUser = user;
    //     $scope.msg_boxClick = !$scope.msg_boxClick;
    //     $scope.msg_wrap = true;
    // }

    console.log("INSIDE adminController");
    $scope.user = Session.user.username;

    $scope.options = $scope.onlineUsers;
    
    $scope.disconnect = function() {
        Session.user = '';
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