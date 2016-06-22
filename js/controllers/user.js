/**
 * Created by Jack on 16/6/18.
 */

var indexModelCtrl = angular.module('indexModelCtrl', [

]);

indexModelCtrl.controller('indexCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $rootScope.landing_page = true;
}]);

var userModelCtrl = angular.module('userModelCtrl', [
    'ui.router',
    'ngCookies',
    'toastr'
]);

userModelCtrl.controller('loginCtrl', function ($scope, $rootScope, $http, $cookies, $state, toastr) {
    if ($cookies.get('SessionToken')) {
        $rootScope.back();
    }
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
                }
            };
            $http(req).then(function successCallback(resp){
                $cookies.put('SessionToken', resp.data.sessionToken);
                $cookies.put('UserId', resp.data.objectId);
                $cookies.put('username', resp.data.username);
                toastr.success('Welcome back! ' + resp.data.username, $rootScope.message_title);
                window.setTimeout(function() {
                    $state.go('index');
                }, 2000);
            }, function errorCallback(resp) {
                toastr.error(resp.data.error, $rootScope.message_title);
            });
        }
    }
});

userModelCtrl.controller('registerCtrl', function ($scope, $rootScope, $http, $cookies, $state, toastr) {
    if ($cookies.get('SessionToken')) {
        $rootScope.back();
    }
    $rootScope.gray_bg = true;
    $scope.submitForm = function(isValid) {
        if (isValid) {
            var req = {
                method: 'POST',
                url: 'https://api.leancloud.cn/1.1/users',
                headers: {
                    'X-LC-Id': $rootScope.LeanCloudId,
                    'X-LC-Key': $rootScope.LeanCloudKey,
                    'Content-Type': 'application/json'
                },
                data: {
                    'username': $scope.username,
                    'email': $scope.email,
                    'password': $scope.password
                }
            };
            $http(req).then(function successCallback(){
                toastr.success('Success! You have received a email, please confirm it.', $rootScope.message_title);
                window.setTimeout(function() {
                    $state.go('user.login');
                }, 2000);
            }, function errorCallback(resp){
                toastr.error(resp.data.error, $rootScope.message_title);
            });
        }
    };
});

userModelCtrl.controller('forgotpasswordCtrl', function ($scope, $rootScope, $cookies, $http, $state, toastr) {
    if ($cookies.get('SessionToken')) {
        $rootScope.back();
    }
    $rootScope.gray_bg = true;
    $scope.submitForm = function(isValid) {
        if (isValid) {
            var req = {
                method: 'POST',
                url: 'https://api.leancloud.cn/1.1/requestPasswordReset',
                headers: {
                    'X-LC-Id': $rootScope.LeanCloudId,
                    'X-LC-Key': $rootScope.LeanCloudKey,
                    'Content-Type': 'application/json'
                },
                data: {'email': $scope.email}
            };
            $http(req).then(function successCallback(){
                toastr.success('Success! You have received a email, please confirm it.', $rootScope.message_title);
                window.setTimeout(function() {
                    $state.go('user.login');
                }, 2000);
            }, function errorCallback(resp){
                toastr.error(resp.data.error, $rootScope.message_title);
            });
        }
    };
});

userModelCtrl.controller('resetpasswordCtrl', function ($scope, $rootScope, $http, $cookies, $state, toastr) {
    if (!$cookies.get('SessionToken')) {
        $rootScope.back();
    }
    $rootScope.gray_bg = true;
    $scope.submitForm = function(isValid) {
        if (isValid) {

            var req1 = {
                method: 'GET',
                url: 'https://api.leancloud.cn/1.1/users/me',
                headers: {
                    'X-LC-Id': $rootScope.LeanCloudId,
                    'X-LC-Key': $rootScope.LeanCloudKey,
                    'X-LC-Session': $cookies.get('SessionToken')
                }
            };
            $http(req1).then(function successCallback(resp){
                $scope.$apply(function () {
                    $scope.ObjId = resp.data.objectId;
                })
            }, function errorCallback(resp) {
                $scope.return_error = true;
                $scope.return_message = resp.data.error;
            });

            var req = {
                method: 'PUT',
                url: 'https://api.leancloud.cn/1.1/users/' + $scope.ObjId + '/updatePassword',
                headers: {
                    'X-LC-Id': $rootScope.LeanCloudId,
                    'X-LC-Key': $rootScope.LeanCloudKey,
                    'X-LC-Session': $cookies.get('SessionToken'),
                    'Content-Type': 'application/json'
                },
                data: {
                    'old_password': $scope.old_password,
                    'new_password': $scope.new_password2
                }
            };
            $http(req).then(function successCallback(){
                toastr.success('Success! Please login again.', $rootScope.message_title);
                $cookies.remove('SessionToken');
                $cookies.remove('UserId');
                $cookies.remove('username');
                window.setTimeout(function() {
                    $state.go('user.login');
                }, 2000);
            }, function errorCallback(resp){
                toastr.error(resp.data.error, $rootScope.message_title);
            });
        }
    };
});
