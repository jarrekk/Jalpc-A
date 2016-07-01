/**
 * Created by Jack on 16/6/25.
 */

var userModelService = angular.module('userModelService', []);

userModelService.factory('user', function($rootScope, $q, $http, $cookies){
    return {
        UserInfo: function(){
            var deferred = $q.defer();
            var req = {
            method: 'GET',
            url: $rootScope.domain + '/users/me',
            headers: {
                'X-LC-Id': $rootScope.LeanCloudId,
                'X-LC-Key': $rootScope.LeanCloudKey,
                'X-LC-Session': $cookies.get('SessionToken')
            }};
            $http(req).then(function successCallback(resp) {
                deferred.resolve(resp);
            }, function errorCallback(resp) {
                deferred.reject(resp);
            });
            return deferred.promise;
        }
    };
});
