(function () {
    'use strict';

    angular
        .module('BlockReducerApp')
        .controller('AdminMainController', Controller);

    function Controller($scope, $http, $location) {
        initcontroller();
        
        function initcontroller() {

        }

        $scope.toUsers = function() {
            $location.path('/admin-users');
        };

        $scope.toEstimate = function() {
            $location.path('/admin-estimate');
        };

        $scope.toChart = function() {
            $location.path('/admin-estimate-chart');
        };
    }
})();