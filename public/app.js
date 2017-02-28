'use strict';

var app = angular.module('app', [
    'ui.router',
    'btorfs.multiselect'
])

angular.element(document).ready(function () {
    angular.bootstrap(document, ['app']);
});