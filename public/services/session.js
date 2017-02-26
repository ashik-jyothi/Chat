angular.module('app')
    .service('Session', function() {
        this.user = window.user;
        // this.isAdmin = window.isAdmin;

        console.log('Sessions init ::::::',this.user);
    })
