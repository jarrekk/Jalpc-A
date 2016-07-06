/**
 * Created by Jack on 16/6/18.
 */

var userModelCtrl = angular.module('userModelCtrl', [
    'ui.router',
    'ngCookies',
    'toastr'
]);

userModelCtrl.controller('loginCtrl', function ($scope, $rootScope, $http, $cookies, $state, $timeout, toastr) {
    $cookies.get('SessionToken') && $rootScope.back();
    $rootScope.gray_bg = true;
    $scope.submitForm = function(isValid) {
        if (isValid) {
            var req = {
            method: 'GET',
            url: 'https://leancloud.cn:443/1.1/login',
            headers: {
                'X-LC-Id': $rootScope.LeanCloudId,
                'X-LC-Key': $rootScope.LeanCloudKey,
                'Content-Type': 'application/json'
            },
            params: {
                'username': $scope.username,
                'password': $scope.password
            }};
            $http(req).then(function successCallback(resp){
                $cookies.put('SessionToken', resp.data.sessionToken);
                toastr.success('Welcome back! ' + resp.data.username, $rootScope.message_title);
                $timeout(function () {
                    $rootScope.back();
                }, 1500);
            }, function errorCallback(resp) {
                toastr.error(resp.data.error, $rootScope.message_title);
            });
        }
    }
});

userModelCtrl.controller('registerCtrl', function ($scope, $rootScope, $http, $cookies, $state, $timeout, toastr) {
    $cookies.get('SessionToken') && $rootScope.back();
    $rootScope.gray_bg = true;
    $scope.regex = '[a-zA-Z0-9]+';
    $scope.submitForm = function(isValid) {
        if (isValid) {
            var req = {
            method: 'POST',
            url: $rootScope.domain + '/users',
            headers: {
                'X-LC-Id': $rootScope.LeanCloudId,
                'X-LC-Key': $rootScope.LeanCloudKey,
                'Content-Type': 'application/json'
            },
            data: {
                'username': $scope.username,
                'email': $scope.email,
                'password': $scope.password
            }};
            $http(req).then(function successCallback(){
                toastr.success('Success! You have received a email, please confirm it.', $rootScope.message_title);
                $timeout(function () {
                    $state.go('user.login');
                }, 1500);
            }, function errorCallback(resp){
                toastr.error(resp.data.error, $rootScope.message_title);
            });
        }
    };
});

userModelCtrl.controller('forgotpasswordCtrl', function ($scope, $rootScope, $cookies, $http, $state, $timeout, toastr) {
    $cookies.get('SessionToken') && $rootScope.back();
    $rootScope.gray_bg = true;
    $scope.submitForm = function(isValid) {
        if (isValid) {
            var req = {
            method: 'POST',
            url: $rootScope.domain + '/requestPasswordReset',
            headers: {
                'X-LC-Id': $rootScope.LeanCloudId,
                'X-LC-Key': $rootScope.LeanCloudKey,
                'Content-Type': 'application/json'
            },
            data: {'email': $scope.email}};
            $http(req).then(function successCallback(){
                toastr.success('Success! You have received a email, please confirm it.', $rootScope.message_title);
                $timeout(function () {
                    $state.go('user.login');
                }, 1500);
            }, function errorCallback(resp){
                toastr.error(resp.data.error, $rootScope.message_title);
            });
        }
    };
});

userModelCtrl.controller('resetpasswordCtrl', function ($scope, $rootScope, $http, $cookies, $state, $timeout, toastr, user) {
    $cookies.get('SessionToken') || $rootScope.back();
    $rootScope.gray_bg = true;
    $scope.GoBack = function() {
        $rootScope.back();
    };
    $scope.submitForm = function(isValid) {
        if (isValid) {
            user.UserInfo().then(function (resp) {
                resp.data.authData ? $scope.username = resp.data.authData.github.username : $scope.username = resp.data.username;
                //$scope.username = resp.data.username;
            }).then(function () {
                var req = {
                method: 'PUT',
                url: $rootScope.domain + '/users/' + resp.data.objectId + '/updatePassword',
                headers: {
                    'X-LC-Id': $rootScope.LeanCloudId,
                    'X-LC-Key': $rootScope.LeanCloudKey,
                    'X-LC-Session': $cookies.get('SessionToken'),
                    'Content-Type': 'application/json'
                },
                data: {
                    'old_password': $scope.old_password,
                    'new_password': $scope.new_password2
                }};
                $http(req).then(function successCallback(){
                    toastr.success('Success! Please login again.', $rootScope.message_title);
                    $cookies.remove('SessionToken');
                    $timeout(function () {
                        $state.go('user.login');
                    }, 1500);
                }, function errorCallback(resp){
                    $scope.old_password = "";
                    $scope.new_password1 = "";
                    $scope.new_password2 = "";
                    toastr.error(resp.data.error, $rootScope.message_title);
                });
            }, function (resp) {
                toastr.error(resp.data.error, $rootScope.message_title);
            })
        }
    };
});
