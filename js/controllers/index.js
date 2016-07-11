/**
 * Created by Jack on 16/7/8.
 */

var indexModelCtrl = angular.module('indexModelCtrl', [

]);

indexModelCtrl.controller('indexCtrl', function ($scope, $rootScope, $http) {
    $rootScope.landing_page = true;
    var req = {
    method: 'GET',
    url: $rootScope.domain + '/classes/Blog',
    headers: {
        'X-LC-Id': $rootScope.LeanCloudId,
        'X-LC-Key': $rootScope.LeanCloudKey,
        'Content-Type': 'application/json'
    },
    params: {
      'order': '-createdAt',
      'limit': 1,
      'skip': 0
    }};
    $http(req).then(function (resp){
        $scope.first_blog = resp.data.results[0];
    });
});
