angular.module('app')
    .service('Session', function() {
        this.user = window.user;
        this.isAdmin = 'test';

        console.log('Sessions init ::::::',this.user,this.isAdmin);
    })
