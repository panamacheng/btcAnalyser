/**
 * Created by HuaChun on 1/14/2019.
 */

var graphPlotter = angular.module('graphPlotter', []);

graphPlotter.directive('linePlot', [function () {
    function linkFunc(scope, element, attrs) {
        scope.$watch('graphPlots', function (plots) {
            Plotly.newPlot(element[0], plots);
        });
    }

    return {
        link: linkFunc
    };
}]);