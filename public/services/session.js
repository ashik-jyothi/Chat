angular.module('app')
    .service('Session', function() {
        this.user = window.user;
         this.clearUser = function (cb){ // having bug here
        	this.user = {};
        	cb()
        }

        console.log('Sessions init ::::::',this.user);
    })
