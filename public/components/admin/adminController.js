angular.module('app')
.controller('adminController', ['$scope', '$document', 'Socket', 'Session', '$state', '$timeout', '$http', function($scope, $document, Socket, Session, $state, $timeout, $http) {
    $scope.user = Session.user.username;
    $scope.disconnect = function() {
        $http.get('/logout').then(function(res){
            $state.go('login')
            console.log("LOGGED OUT")});}

    // $scope.enterRoom = function() {
    //     var room = "test"
    //     Socket.emit('joinRoom', room, function(res) {
    //         console.log("joined");
    //         $state.go('chat')
    //     })
    // }
    Socket.emit("getRooms", {}, function(res) {
        console.log("getRooms");
        console.log(res.roomname);
        $scope.rooms = res;
    })
    Socket.emit("getUsers", {}, function(res) {
        console.log("getUsers");
        console.log(res);
        $scope.users = res;
    })
}]);