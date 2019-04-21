(function () {
    'use strict';

    angular
        .module('BlockReducerApp')
        .controller('AccountController', Controller);

    function Controller($scope, $window, $location, UserService, FlashService, $rootScope) {
        var vm = this;
        vm.user = null;
        vm.saveUser = SaveUser;
        vm.deleteUser = DeleteUser;

        initController();

        function initController() {
            // get current user 
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
            });
           
        }

        function SaveUser() {
            if (vm.user.password == vm.user.confirm) {
                UserService.Update(vm.user)
                    .then(function () {
                        FlashService.Success('User updated');
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
            }else{
                FlashService.Error('Please Check Password Confirm ');
            }             
           
        }

        function DeleteUser() {
            UserService.Delete(vm.user._id)
                .then(function () {
                    // log user out
                    $window.location = '/login';
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        $scope.all = true;
        $scope.EditFields = function() {
            $scope.all = false;
        };

        $scope.toAccInfo = function() {
            $location.path('/account');
        };

        $scope.toAccChange = function(){
            $location.path('/change-password');
        };
    }
})();