(function () {
    'use strict';

    angular
        .module('BlockReducerApp')
        .controller('FFTChartController', Controller);

    function Controller($scope, $http, $window) {
        $scope.trace1 = {
            x: [], 
            close: [], 
            decreasing: {line: {color: '#585858'}}, 
            high: [], 
            increasing: {line: {color: '#17cf84'}},
            line: {color: 'rgba(31,119,180,1)'},
            low: [],
            open: [],
            type: 'ohlc',
            xaxis: 'x',
            yaxis: 'y'
        };

        initcontroller();
        
        function initcontroller() {
            $http({
                method: "POST",
                url: "/chart/fft/init",
                data: {
                    str: "init"
                }
            }).then(function(res) {
                var tmpData = res.data;
                for (var obj of tmpData) {
                    $scope.trace1.x.push(obj.isoDate);
                    $scope.trace1.open.push(obj.open);
                    $scope.trace1.high.push(obj.high);
                    $scope.trace1.low.push(obj.low);
                    $scope.trace1.close.push(obj.close);
                }
                
                var data = [$scope.trace1];
    
                var layout = {
                    dragmode: 'zoom',
                    margin: {
                        r: 10,
                        t: 25,
                        b: 40,
                        l: 60
                    },
                    showlegend: false,
                    xaxis: {
                        autorange: true,
                        rangeslider: {},
                        title: 'Date',
                        type: 'date'
                    },
                    yaxis: {
                        autorange: true,
                        type: 'linear'
                    }
                };
    
                Plotly.plot('plotly-div', data, layout);

                
            });
        }

        $scope.CustomizeChart = function() {
            var startTime = new Date($scope.startTime).toISOString();
            var endTime = new Date($scope.endTime).toISOString();
    
            if ($scope.startTime > $scope.endTime) {
                $window.alert('Please Check your "Start Time"!');
            } else {
                $http({
                    method: "POST",
                    url: "/chart/fft/custom",
                    data: {
                        startTime: startTime,
                        endTime: endTime
                    }
                }).then(function(res) {
                    $scope.trace1 = {x: [], close: [],decreasing: {line: {color: '#585858'}}, high: [], increasing: {line: {color: '#17cf84'}}, 
                        line: {color: 'rgba(31,119,180,1)'}, low: [],open: [],type: 'ohlc',xaxis: 'x', yaxis: 'y'
                    };
                    var tmpData = res.data;
                    for (var obj of tmpData) {
                        $scope.trace1.x.push(obj.isoDate);
                        $scope.trace1.open.push(obj.open);
                        $scope.trace1.high.push(obj.high);
                        $scope.trace1.low.push(obj.low);
                        $scope.trace1.close.push(obj.close);
                    }
                    
                    var data = [$scope.trace1];
        
                    var layout = {
                        dragmode: 'zoom',
                        margin: { r: 10, t: 25, b: 40, l: 60 },
                        showlegend: false,
                        xaxis: {
                            autorange: true,
                            rangeslider: {},
                            title: 'Date',
                            type: 'date'
                        },
                        yaxis: {
                            autorange: true,
                            type: 'linear'
                        }
                    };
        
                    Plotly.plot('plotly-div', data, layout);
                });

               
            }
        };
        
    }

})();