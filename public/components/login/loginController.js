angular.module('app')
.controller('loginController', ['$scope', '$document', 'Socket', 'Session', '$state', '$timeout', '$http','$rootScope', function($scope, $document, Socket, Session, $state, $timeout, $http,$rootScope){

	$scope.errorText = '';
	$scope.login = function(e){
			e.preventDefault();
			if(angular.isUndefined($scope.username) || angular.isUndefined($scope.password)){
		        $scope.errorText = "Enter Valid Details";
		        console.log("HERE:::;");
			}else{
				console.log("login function executed");
				var username = $scope.username;
				var password = $scope.password;
				Socket.emit("isAdmin",username,function(res){

					console.log("RES::",res)
					if(res == 1){
						Session.isAdmin = 'true';
						console.log("isAdmin::",Session);
					}else{
						Session.isAdmin = 'false';
					}
					console.log('session at logincontroller:::',Session);
					document.getElementById('login_form').submit();



				})

				}
		}

}]);