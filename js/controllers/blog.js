/**
 * Created by Jack on 16/6/18.
 */

var blogModelCtrl = angular.module('blogModelCtrl', []);

blogModelCtrl.controller('blogsCtrl', function ($scope, $rootScope, $http, $cookies) {
    $rootScope.landing_page = true;
    $scope.username = $cookies.get('username');
    var req = {
        method: 'GET',
        url: 'https://api.leancloud.cn/1.1/classes/Blog',
        headers: {
            'X-LC-Id': $rootScope.LeanCloudId,
            'X-LC-Key': $rootScope.LeanCloudKey,
            'Content-Type': 'application/json'
        },
        params: {'order': '-createdAt'}
    };
    $http(req).then(function successCallback(resp){
        $scope.blogs = resp.data.results;
    });
    $scope.logout = function () {
        $cookies.remove('SessionToken');
        $cookies.remove('UserId');
        $cookies.remove('username');
        window.location.reload();
    }
});

blogModelCtrl.controller('addblogCtrl', function ($scope, $rootScope, $http, $state, $cookies, toastr) {
    if ($cookies.get('UserId') !== $rootScope.AdminId) {
        $rootScope.back();
    }
    $rootScope.landing_page = true;
    $scope.submitForm = function (isValid) {
        if (isValid) {
            var acl = {};
            acl[$cookies.get('UserId')] = {"read": true,"write": true};
            acl["*"] = {"read": true};
            var req = {
                method: 'POST',
                url: 'https://api.leancloud.cn/1.1/classes/Blog',
                headers: {
                    'X-LC-Id': $rootScope.LeanCloudId,
                    'X-LC-Key': $rootScope.LeanCloudKey,
                    'Content-Type': 'application/json'
                },
                data: {
                    'title': $scope.blog_title,
                    'content': $scope.summernote_text,
                    "ACL": acl
                }
            };
            $http(req).then(function successCallback(resp){
                toastr.success('Success! You have added a blog.', $rootScope.message_title);
                $scope.blog_objId = resp.data.objectId;
                $scope.blogs.push({
                    'title': $scope.blog_title,
                    'content': $scope.summernote_text,
                    'createdAt': resp.data.createdAt,
                    'objectId': resp.data.objectId
                });
                window.setTimeout(function() {
                    window.location.reload();
                    // console.log($scope.blogs);
                    $state.go('blogs.detail', {'blogId': $scope.blog_objId});
                }, 2000);
            }, function errorCallback(resp){
                toastr.error(resp.data.error, $rootScope.message_title);
            });
        }
    };
});

blogModelCtrl.controller('blogCtrl', function ($scope, $rootScope, $stateParams, $http, $state, $cookies, toastr, utils) {
    $rootScope.landing_page = true;
    var req = {
        method: 'GET',
        url: 'https://api.leancloud.cn/1.1/classes/Blog',
        headers: {
            'X-LC-Id': $rootScope.LeanCloudId,
            'X-LC-Key': $rootScope.LeanCloudKey,
            'Content-Type': 'application/json'
        },
        params: {'order': '-createdAt'}
    };
    $http(req).then(function successCallback(resp){
        if ($cookies.get('UserId') !== $rootScope.AdminId) {
            $scope.ctrl = false;
        } else {
            $scope.ctrl = true;
        }
        $scope.blogs = resp.data.results;
        $scope.blog = utils.findById($scope.blogs, $stateParams.blogId);
        $scope.delete_blog = function (objectId) {
            if ($cookies.get('UserId') !== $rootScope.AdminId) {
                $rootScope.back();
            }
            var req = {
                method: 'DELETE',
                url: 'https://api.leancloud.cn/1.1/classes/Blog/' + objectId,
                headers: {
                    'X-LC-Id': $rootScope.LeanCloudId,
                    'X-LC-Key': $rootScope.LeanCloudKey,
                    'X-LC-Session': $cookies.get('SessionToken'),
                    'Content-Type': 'application/json'
                }
            };
            $http(req).then(function successCallback(resp){
                toastr.success('Success! The blog has been deleted.', $rootScope.message_title);
                window.setTimeout(function() {
                    $state.go('blogs');
                }, 2000);
            }, function errorCallback(resp) {
                toastr.error(resp.data.error, $rootScope.message_title);
            });
        }
    });
});

blogModelCtrl.controller('editblogCtrl', function ($scope, $rootScope, $stateParams, $cookies, $http, $state, toastr, utils) {
    if ($cookies.get('UserId') !== $rootScope.AdminId) {
        $rootScope.back();
    }
    $rootScope.landing_page = true;
    var req = {
        method: 'GET',
        url: 'https://api.leancloud.cn/1.1/classes/Blog',
        headers: {
            'X-LC-Id': $rootScope.LeanCloudId,
            'X-LC-Key': $rootScope.LeanCloudKey,
            'Content-Type': 'application/json'
        },
        params: {'order': '-createdAt'}
    };
    $http(req).then(function successCallback(resp){
        $scope.blogs = resp.data.results;
        $scope.blog = utils.findById($scope.blogs, $stateParams.blogId);
        $scope.submitForm = function(isValid) {
            if (isValid) {
                var blog_objectId = $scope.blog.objectId;
                // console.log(blog_objectId);
                var req = {
                    method: 'PUT',
                    url: 'https://api.leancloud.cn/1.1/classes/Blog/' + blog_objectId,
                    headers: {
                        'X-LC-Id': $rootScope.LeanCloudId,
                        'X-LC-Key': $rootScope.LeanCloudKey,
                        'X-LC-Session': $cookies.get('SessionToken'),
                        'Content-Type': 'application/json'
                    },
                    data: {
                        'title': $scope.blog.title,
                        'content': $scope.blog.content
                    }
                };
                $http(req).then(function successCallback(resp){
                    toastr.success('Success! The blog has been updated.', $rootScope.message_title);
                    window.setTimeout(function() {
                        $state.go('blogs.detail', {'blogId': blog_objectId});
                    }, 2000);
                }, function errorCallback(resp) {
                    toastr.error(resp.data.error, $rootScope.message_title);
                });
            }
        }
    });
});