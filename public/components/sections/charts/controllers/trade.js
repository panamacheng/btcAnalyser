(function () {
    'use strict';

    angular
        .module('BlockReducerApp')
        .controller('CurrentTradeController', Controller);

    function Controller($scope, $http, $window) {
        $scope.graphData = {
            x: [], y:[], type: 'scatter'
        }
    
        initController();

        function initController() {
            $http({
                method: "POST",
                url: "/chart/trade/init",
                data: {
                    str: "init"
                }
            }).then((res) => {
                var tmpData = res.data;
                console.log(res.data);
                for (var obj of tmpData) {
                    $scope.graphData.x.push(obj.isoDate);
                    $scope.graphData.y.push(obj.price);                
                }
    
                $scope.graphPlots = [$scope.graphData];
    
                $scope.graphData = {
                    x: [], y:[], type: 'scatter'
                }
            });
        }

        // $scope.CustomizeChart = function() {
        //     var startTime = new Date($scope.startTime).toISOString();
        //     var endTime = new Date($scope.endTime).toISOString();
    
        //     if ($scope.startTime > $scope.endTime) {
        //         $window.alert('Please Check your "Start Time"!')
        //     } else {
        //         $http({
        //             method: "POST",
        //             url: "/chart/price/custom",
        //             data: {
        //                 startTime: startTime,
        //                 endTime: endTime
        //             }
        //         }).then((res) => {
        //             var tmpData = res.data;
        //             for (var obj of tmpData) {
        //                 $scope.graphData.x.push(obj.isoDate);
        //                 $scope.graphData.y.push(obj.close)
        //             }
    
        //             $scope.graphPlots = [$scope.graphData];
    
        //             $scope.graphData = {
        //                 x: [], y:[], type: 'scatter'
        //             }
        //         });
        //     }
        
    }

})();