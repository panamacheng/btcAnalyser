(function () {
    'use strict';

    angular
        .module('BlockReducerApp')
        .factory('UserService', Service);

    function Service($http, $q) {
        var service = {};

        service.GetCurrent = GetCurrent;
        service.GetAll = GetAll;
        // service.GetById = GetById;
        // service.GetByUsername = GetByUsername;
        // service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.ChangePassword = ChangePassword;
        service.GetDateTime = GetDateTime;
        service.GetEstimateData = GetEstimateData;
        
        return service;

        function GetCurrent() {
            return $http.get('/api/users/current').then(handleSuccess, handleError);
        }

        function GetAll() {
            return $http.get('/api/users').then(handleSuccess, handleError);
        }

        function GetDateTime(userId){
            return $http.get('/api/users/gettime/' + userId).then(handleSuccess, handleError);
        }

        function GetEstimateData(info){
            return $http.post('/api/users/estimate',{"userid":info.userid,"savedatetime":info.datetime}).then(handleSuccess,handleError);
        }


        // function GetById(_id) {
        //     return $http.get('/api/users/' + _id).then(handleSuccess, handleError);
        // }

        // function GetByUsername(username) {
        //     return $http.get('/api/users/' + username).then(handleSuccess, handleError);
        // }

        // function Create(user) {
        //     return $http.post('/api/users', user).then(handleSuccess, handleError);
        // }

        function Update(user) {
            return $http.put('/api/users/' + user._id, user).then(handleSuccess, handleError);
        }

        function Delete(_id) {
            return $http.delete('/api/users/' + _id).then(handleSuccess, handleError);
        }

        function ChangePassword(user){
            console.log(user);
            return $http.post('/api/users/change-password',{"currPass":user.currentpassword,"newPass":user.newpassword}).then(handleSuccess, handleError);
        }

        // private functions
        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
