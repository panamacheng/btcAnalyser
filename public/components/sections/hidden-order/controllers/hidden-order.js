(function () {
    'use strict';

    angular
        .module('BlockReducerApp')
        .controller('HiddenOrderController', Controller);

    function Controller($scope, $http, $window) {
        $scope.trace1 = {
            x: [],
            y: [],
            name: 'yaxis1 data',
            yaxis: 'y1',
            type: 'scatter'
        };

        $scope.trace2 = {
            x: [],
            y: [],
            name: 'yaxis2 data',
            yaxis: 'y2',
            type: 'scatter'
        };

        initController();

        function initController() {
            $http({
                method: "POST",
                url: "/chart/hidden/init",
                data: {
                    str: "init"
                }
            }).then((res) => {
                $scope.trace1.x = [];
                $scope.trace1.y = [];
                $scope.trace2.x = [];
                $scope.trace2.y = [];

                var tmpData = res.data;
                for (var obj of tmpData) {
                    $scope.trace1.x.push((new Date(obj.isoDate)).toISOString());
                    $scope.trace2.x.push((new Date(obj.isoDate)).toISOString());
                    $scope.trace1.y.push(parseFloat(obj.price));
                    $scope.trace2.y.push(parseFloat(obj.size));
                }

                var data1 = [$scope.trace1];
                console.log(data1);
                var layout1 = {
                    yaxis: {
                      title: 'yaxis1 title',
                      titlefont: {color: 'rgb(148, 103, 189)'},
                      tickfont: {color: 'rgb(148, 103, 189)'},
                      overlaying: 'y1',
                      side: 'right'
                    }
                };
                Plotly.newPlot('price-isoDate-chart', data1, layout1);

                var data2 = [$scope.trace2];

                var layout2 = {
                    yaxis: {
                      title: 'yaxis2 title',
                      titlefont: {color: 'rgb(94, 199, 72)'},
                      tickfont: {color: 'rgb(94, 199, 72)'},
                      overlaying: 'y2',
                      side: 'right'
                    }
                };
                
                Plotly.newPlot('hidden-isoDate-chart', data2, layout2);
                console.log(data2);
            });
        }
    }

})();