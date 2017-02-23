angular.module('app')
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('empty', {
                url: '/',
            })
            .state('login', {
                url: '/login',
                views: {
                    'content': {
                        templateUrl: 'components/login/login.html'
                    }
                }
            })
            .state('admin', {
                url: '/admin',
                views: {
                    'content': {
                        templateUrl: 'components/admin/adminpage.html'
                    }
                }
            })
            .state('chat', {
                url: '/chat',
                views: {
                    'content': {
                        templateUrl: 'components/chat/chat.html'
                    }
                }
            })

    }])
    .run(['$rootScope', '$state', 'Session', function ($rootScope, $state, Session) {
        console.log("Before state change",Session);
        $rootScope.$on('$stateChangeStart', function (e, toState) {
            console.log('inside .run',Session)

            if (toState.url == '/') {
                e.preventDefault();
                if (Session.user) {
                    console.log("HERE");
                    $state.go('admin')
                } //else if(Session.user && Session.isAdmin == 'false'){
                //     e.preventDefault();
                //     console.log("HERE1");
                //     $state.go('chat')
                // }
                else {
                    console.log("HERE2");
                    $state.go('login')
                }
            } else if (!Session.user && toState.url != '/login') {
                e.preventDefault();
                console.log("HERE3");
                $state.go('login')
            } //else if (Session.user && toState.url == '/chat') {    //login
            //     // e.preventDefault();
            //     $state.go('chat')
            //  } //else if (Session.user && toState.url == '/frontpage') {
            //     e.preventDefault();
            //     $state.go('frontpage') 
            // }
            return;
        });
    }])
