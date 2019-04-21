(function () {
    'use strict';

    angular
        .module('BlockReducerApp')
        .controller('HomeController', Controller);

    function Controller(UserService, $rootScope) {
        var vm = this;

        vm.user = null;

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
                
            });
        }
        //  = Userinfor.name;
    }

})();