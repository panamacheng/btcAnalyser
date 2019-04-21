(function () {
    'use strict';

    angular
        .module('BlockReducerApp')
        .controller('AdminUsersController', Controller);

    function Controller($scope, $http, $window, $location, UserService) {
        initcontroller();
        
        function initcontroller() {
            UserService.GetAll().then(function (user) {
                $scope.data = user;
            });
        }

        $scope.editInfo = function(info){
            $scope.currentUser = info;
            $scope.pass = false;
            $scope.header = "Update User Details";
            $scope.btn_text = "Update";
            flag = 'Update';
            
        }

        $scope.currentUser;
        $scope.UpdateInfo = function(info){ 
            if(flag=='Update'){
                UserService.Update(info)
                .then(function(data){
                    initController();
                }) 
            }else if(flag=='Insert'){
                if($scope.currentUser.password==$scope.currentUser.passwordconfirm){
                    UserService.Create($scope.currentUser)
                        .then(function(data){
                            initController();
                    }) 
                }else{
                    alert("Password Confirm Error");
                }
            } 
        }

        $scope.deleteInfo = function(info){
            if(confirm("Are you really delete this user?")==true){
                UserService.Delete(info.id).
                    then(function(data){
                        initController();
                    });     
            } 
        }

        $scope.createUser = function(){
            $scope.currentUser = [];
            $scope.header = "Insert New User";
            $scope.btn_text = "Insert";
            flag = 'Insert';
            $scope.pass = true;
        }

        $scope.orderByMe = function(x){
            $scope.myOrderBy = x;
        }

        $scope.toMain = function() {
            $location.path('/admin');
        }

        $scope.toEstimate = function() {
            $location.path('/admin-estimate');
        }

        $scope.toChart = function() {
            $location.path('/admin-estimate-chart');
        }
    }
})();