(function () {
    'use strict';

    angular
        .module('BlockReducerApp')
        .controller('VolumeChartController', Controller);

    function Controller($scope, $http, $window) {
        $scope.trace1 = {
            x: [], 
            close: [], 
            decreasing: {line: {color: '#7F7F7F'}}, 
            high: [], 
            increasing: {line: {color: '#17BECF'}},
            line: {color: 'rgba(31,119,180,1)'},
            low: [],
            open: [],
            type: 'ohlc',
            xaxis: 'x',
            yaxis: 'y'
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
                url: "/chart/volume/init",
                data: {
                    str: "init"
                }
            }).then(function(res) {
                $scope.trace1.x = [];
                $scope.trace1.close = [];
                $scope.trace1.high = [];
                $scope.trace1.low = [];
                $scope.trace1.open = [];
                $scope.trace2.x = [];
                $scope.trace2.y = [];

                var tmpData = res.data;
                for (var obj of tmpData[0]) {
                    var volume = obj.BuySize - obj.SellSize
                    $scope.trace2.x.push(obj.isoDate);
                    $scope.trace2.y.push(volume);                
                }

                for (var obj of tmpData[1]) {
                    $scope.trace1.x.push(obj.isoDate);
                    $scope.trace1.open.push(obj.open);
                    $scope.trace1.high.push(obj.high);
                    $scope.trace1.low.push(obj.low);
                    $scope.trace1.close.push(obj.close);
                }
    
                var data = [$scope.trace1, $scope.trace2];

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
                        title: 'Price',
                        autorange: true,
                        type: 'linear'
                    },
                    yaxis2: {
                        title: 'Volume',
                        titlefont: {color: 'rgb(148, 103, 189)'},
                        tickfont: {color: 'rgb(148, 103, 189)'},
                        overlaying: 'y',
                        side: 'right'
                    }
                };

                Plotly.newPlot('plotly-div', data, layout);

                var data2 = [$scope.trace2];

                var layout2 = {
                    yaxis: {
                      title: 'Volume',
                      titlefont: {color: 'rgb(148, 103, 189)'},
                      tickfont: {color: 'rgb(148, 103, 189)'},
                      overlaying: 'y',
                      side: 'right'
                    }
                };

                Plotly.newPlot('plotly-volume', data2, layout2);
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
        //             url: "/chart/volume/custom",
        //             data: {
        //                 startTime: startTime,
        //                 endTime: endTime
        //             }
        //         }).then((res) => {
        //             var tmpData = res.data;
        //             console.log(tmpData);
        //             for (var obj of tmpData) {
        //                 var volume = obj.BuySize - obj.SellSize
        //                 $scope.graphData.x.push(obj.isoDate);
        //                 $scope.graphData.y.push(volume);                
        //             }
    
        //             $scope.graphPlots = [$scope.graphData];
    
        //             $scope.graphData = {
        //                 x: [], y:[], type: 'scatter'
        //             }
        //         });
        //     }
        // }
    }

})();