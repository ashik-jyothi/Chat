angular.module('app')
.controller('adminController', ['$scope', '$document', 'Socket', 'Session', '$state', '$timeout', '$http', function($scope, $document, Socket, Session, $state, $timeout, $http) {

    //Testing isAdmin
    Session.isAdmin = 'adminController';
    console.log("isAdmin",Session.isAdmin);

    console.log("INSIDE adminController");
    $scope.user = Session.user.username;
    $scope.disconnect = function() {
        $http.get('/logout').then(function(res){
            $state.go('login')
            console.log("LOGGED OUT")});}

    $scope.sendMessage = function(msg) {
            var timestamp = moment().valueOf();
            var momentTime = moment.utc(timestamp);
            momentTime = momentTime.local().format('h:mm a');

            if(!angular.isUndefined(msg)) {
                console.log(msg);
            var newMessage = {
                sender: $scope.user,
                receiver: 'All',
                message: text,
                time: momentTime
                            }

            }
    }

    Socket.emit("getUsers", {}, function(res) {
        console.log("getUsers");
        console.log(res);
        $scope.users = res;
    })
}]);