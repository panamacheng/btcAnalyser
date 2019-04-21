(function () {
    'use strict';

    angular
        .module('BlockReducerApp', ['ui.router', 'graphPlotter', 'angularjs-datetime-picker','ngAnimate', 'ngSanitize', 'ui.bootstrap'])
        .config(config)
        .run(run);

    function config($stateProvider, $urlRouterProvider, $qProvider) {
        $qProvider.errorOnUnhandledRejections(true);
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: './components/sections/home/views/home.html',
                controller: 'HomeController',
                controllerAs: 'vm',
                data: { activeTab: 'home'}
            })

            .state('account', {
                url: '/account',
                templateUrl: './components/sections/account/views/account.html',
                controller: 'AccountController',
                controllerAs: 'vm',
                data: { activeTab: 'account' }
            })

            .state('change-password', {
                url: '/change-password',
                templateUrl: './components/sections/account/views/change-password.html',
                controller: 'ChangePasswordController',
                controllerAs: 'vm',
                data: { activeTab: 'change-password' }
            })

            .state('price-chart', {
                url: '/price',
                templateUrl: './components/sections/charts/views/price.html',
                controller: 'PriceChartController',
                controllerAs: 'vm',
                data: { activeTab: 'priceChart' }
            })

            .state('volume-chart', {
                url: '/volume',
                templateUrl: './components/sections/charts/views/volume.html',
                controller: 'VolumeChartController',
                controllerAs: 'vm',
                data: { activeTab: 'volumeChart' }
            })

            .state('current-trade-chart', {
                url: '/trade',
                templateUrl: './components/sections/charts/views/trade.html',
                controller: 'CurrentTradeController',
                controllerAs: 'vm',
                data: { activeTab: 'tradeChart' }
            })

            .state('fft-chart', {
                url: '/fft',
                templateUrl: './components/sections/fft/views/fft.html',
                controller: 'FFTChartController',
                controllerAs: 'vm',
                data: { activeTab: 'fftChart' }
            })

            .state('hidden-order', {
                url: '/hidden',
                templateUrl: './components/sections/hidden-order/views/hidden-order.html',
                controller: 'HiddenOrderController',
                controllerAs: 'vm',
                data: { activeTab: 'fftChart' }
            })

            .state('admin', {
                url: '/admin',
                templateUrl: './components/sections/admin/main/views/main.html',
                controller: 'AdminMainController',
                controllerAs: 'vm',
                data: { activeTab: 'admin' }
            })

            .state('admin-users', {
                url: '/admin-users',
                templateUrl: './components/sections/admin/users/views/users.html',
                controller: 'AdminUsersController',
                controllerAs: 'vm',
                data: { activeTab: 'adminUser' }
            })

            .state('admin-estimate', {
                url: '/admin-estimate',
                templateUrl: './components/sections/admin/estimate/views/estimate.html',
                controller: 'AdminEstimateController',
                controllerAs: 'vm',
                data: { activeTab: 'adminEstimate' }
            })

            .state('admin-estimate-chart', {
                url: '/admin-estimate-chart',
                templateUrl: './components/sections/admin/estimate-chart/views/estimate-chart.html',
                controller: 'AdminEstimateChartController',
                controllerAs: 'vm',
                data: { activeTab: 'adminEstimateChart' }
            });
    }

    function run($http, $rootScope, $window, UserService) {
        // add JWT token as default auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;
        
        // update active tab on state change
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.activeTab = toState.data.activeTab;
        });

        UserService.GetCurrent().then(function(user) {
            $rootScope.username  = user.username;
            $rootScope.auth = user.auth;
            var role = user.auth; 
            if(role=='admin'){ 
                // $('a#admin_li').remove();
                var admin_li = "<li class='sidebar'><a ui-sref='admin' href='#!/admin' id='admin_li' onmouseover=''><i class='fa fa-tachometer-alt'></i><span>Admin Panel</span></a></li>";
                $("li#block_chart").before(admin_li);
            }
            $('p#username').text($rootScope.username);
            $('span#user-role').text($rootScope.auth);
        });
    }

    // manually bootstrap angular after the JWT token is retrieved from the server
    $(function () {
        // get JWT token from server
        $.get('/app/token', function (token) {
            window.jwtToken = token;
            angular.bootstrap(document, ['BlockReducerApp']);
        });
    });
})();