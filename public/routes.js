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
            .state('agent', {
                url: '/agent',
                views: {
                    'content': {
                        templateUrl: 'components/agent/agent.html'
                    }
                }
            })

    }])
    .run(['$rootScope', '$state', 'Session', function ($rootScope, $state, Session) {
        console.log("Before state change",Session);
        $rootScope.$on('$stateChangeStart', function (e, toState) {
            console.log('inside .run',Session.user)

            if (toState.url == '/') {
                e.preventDefault();
                if (Session.user && Session.user.admin == 'true') {
                    console.log("HERE");
                    $state.go('admin')
                } else if(Session.user && Session.user.admin == 'false'){
                    e.preventDefault();
                    console.log("HERE1");
                    $state.go('agent')
                }
                else {
                    console.log("HERE2");
                    $state.go('login')
                }
            } else if (!Session.user && toState.url != '/login') {
                e.preventDefault();
                console.log("HERE3");
                $state.go('login')
            }
            return;
        });
    }])
