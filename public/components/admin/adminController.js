angular.module('app')
.controller('adminController', ['$scope', '$document', 'Socket', 'Session', '$state', '$timeout', '$http', function($scope, $document, Socket, Session, $state, $timeout, $http) {

    $scope.onlineUsers = [];
    $scope.userObj = {};
    $scope.selectedCount = 0;
    // var popupCount = 0;

    Socket.emit("getUsers", {}, function(res) {
        console.log("getUsers::::::::::::::::");
        res.forEach(function(u){
            $scope.onlineUsers.push(u.username);
        })
        $scope.onlineUsers.forEach(function(x){
            $scope.userObj[x] = {
            selected: false
        }
        })
        console.log("GETUSERS RESULT",$scope.onlineUsers);
        // $scope.users = res;
    })

    /*=============================
    =            popup            =
    =============================*/
    console.log("USEROBJ",$scope.userObj);
    $scope.message = [];
    $scope.msg_wrap = [];
    $scope.chat_boxClick = false;
    $scope.msg_boxClick = [];
    $scope.clickedUser = [];

    var initShow = function(){
        console.log("INSIDE INITSHOW");
        for(var i=0; i < 3; i++){
            $scope.msg_wrap[i] = false;
            $scope.chat_boxClick[i] = false;
            $scope.msg_boxClick[i] = false;
            $scope.clickedUser[i] = "";
        }
    }
    initShow();

    $scope.chatbox = function(user){
        var matchFound = false;
        for(var i=0; i < 3; i++){
            if($scope.clickedUser[i] == user){
                matchFound = true;  
                $scope.msg_wrap[i] = !($scope.msg_wrap[i])
                }
            }
        // console.log("matchFound",matchFound)
        if($scope.selectedCount == 0 && matchFound == false){
            if($scope.msg_boxClick[0]==false){
                console.log("HERE::")
                $scope.clickedUser[0] = user;
                $scope.msg_boxClick[0] = true;
                $scope.msg_wrap[0] = true;
            }
            else if($scope.msg_boxClick[1]==false){
                console.log("HERE1::")
                $scope.clickedUser[1] = user;
                $scope.msg_boxClick[1] = true;
                $scope.msg_wrap[1] = true;          
            }
            else if($scope.msg_boxClick[2]==false){
                console.log("HERE2::")
                $scope.clickedUser[2] = user;
                $scope.msg_boxClick[2] = true;
                $scope.msg_wrap[2] = true;
            }               
                else {
                    console.log("HERE3::")
                $scope.clickedUser[0] = user;
                $scope.msg_boxClick[0] = true;
                $scope.msg_wrap[0] = true;              
                }

            console.log("SELECTED USERS:::",$scope.selectedCount);
        }

    }
    
    $scope.selection = function(user){
        if($scope.selectedCount == 0){
            initShow();
        }
        if($scope.userObj[user].selected){
            $scope.userObj[user].selected = false;
            $scope.selectedCount -= 1;
                    if($scope.selectedCount == 0){
                        initShow();
                        }
        }else {
            $scope.userObj[user].selected = true;
            $scope.selectedCount += 1;
        }

        if($scope.selectedCount > 1){
            console.log("INSIDE 1")
            $scope.clickedUser[0] = $scope.selectedCount + " Selected";
            $scope.msg_boxClick[0] = true;
            $scope.msg_wrap[0] = true;
        }else {
            console.log("INSIDE2")
            $scope.clickedUser[0] = user;
            $scope.msg_boxClick[0] = true;
            $scope.msg_wrap[0] = true;
        }
        console.log($scope.userObj);
        console.log($scope.selectedCount,"selected");

    }

    $scope.close = function(index){
        $scope.msg_boxClick[index] = !$scope.msg_boxClick[index];
        $scope.msg_wrap[index] = !$scope.msg_wrap[index]; 
        $scope.clickedUser[index] = "";
    }

    $scope.selectall = function(){
        for(prop in $scope.userObj){
            $scope.userObj[prop].selected = true;
            // console.log("HERE");
        }
        $scope.selectedCount = Object.keys($scope.userObj).length;
        $scope.clickedUser[0] = $scope.selectedCount + " Selected";
        $scope.msg_boxClick[0] = true;
        $scope.msg_wrap[0] = true;
        console.log("SELECTEDCOUNT",$scope.selectedCount,$scope.userObj);
    }

    $scope.selectnone = function(){
        for(prop in $scope.userObj){
            $scope.userObj[prop].selected = false;
            // console.log("HERE2  ");
        }
        $scope.selectedCount = 0;
        initShow();
        console.log("SELECTEDCOUNT",$scope.selectedCount,$scope.userObj);
    }
    
    
    /*=====  End of popup  ======*/


    // console.log("INSIDE adminController");
    $scope.user = Session.user.username;

    if($scope.user == "Ashik"){
        console.log("THE MAIN ADMIN");
        
    }

    // $scope.options = $scope.onlineUsers;
    
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
    $scope.inputMessage = function(event,user,index){
        if(event.charCode == 13 && $scope.message[index] != ""){
            console.log("MESSAGE:::",user,"-->",$scope.message[index]);
            $scope.message[index] = "";
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
}]);