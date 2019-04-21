(function () {
    'use strict';

    angular
        .module('BlockReducerApp')
        .controller('ChangePasswordController', Controller);

    function Controller($scope, $window, $location, UserService, FlashService, $rootScope) {
        var vm = this;

        vm.user = null;
        vm.saveUser = SaveUser;

        initController();

        function initController() {
            // get current user 
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
            });
        }

        function SaveUser() {
            UserService.Update(vm.user)
                .then(function () {
                    FlashService.Success('User updated');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        $scope.ChangePassword =  function (current) {
            UserService.ChangePassword(current)
                .then(function (result) {
                    FlashService.Success(result);
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        };


        $scope.toAccInfo = function() {
            $location.path('/account');
        };

        $scope.toAccChange = function(){
            $location.path('/change-password');
        };
    }
})();