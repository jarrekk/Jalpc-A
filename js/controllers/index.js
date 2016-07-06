/**
 * Created by Jack on 16/7/8.
 */

var indexModelCtrl = angular.module('indexModelCtrl', [

]);

indexModelCtrl.controller('indexCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $rootScope.landing_page = true;
}]);
