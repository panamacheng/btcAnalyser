(function () {
    'use strict';

    angular
        .module('BlockReducerApp')
        .controller('AdminEstimateController', Controller);

    function Controller($scope, $http, $window, $location, UserService) {
        var vm = this;
        vm.GetDateTime = GetDateTime;
        vm.GetEstimateData = GetEstimateData;
        
        initcontroller();
        
        $scope.users = [];
        // $scope.GetEstimateData;
        
        function initcontroller() {
            UserService.GetAll().then(function (user) {
                for(var obj of user ){
                    if(obj.auth == "admin"){
                        $scope.users.push(obj);
                    }
                }
            });
        }

        function GetDateTime(userId) {
            UserService.GetDateTime(userId).then(function(data) {
                $scope.dateTimes = data;
            });
        }

        function GetEstimateData(info) {
            UserService.GetEstimateData(info).then(function(data) {
                $scope.data = data;
            });
        }

        $scope.toUsers = function() {
            $location.path('/admin-users');
        };

        $scope.toMain = function() {
            $location.path('/admin');
        };

        $scope.toChart = function() {
            $location.path('/admin-estimate-chart');
        };
    }
})();