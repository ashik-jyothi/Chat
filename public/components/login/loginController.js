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

					console.log('session at logincontroller:::',Session);
					document.getElementById('login_form').submit();

				}
		}

}]);