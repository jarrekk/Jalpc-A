/**
 * Created by Jack on 16/6/18.
 */

var blogModelCtrl = angular.module('blogModelCtrl', []);

blogModelCtrl.controller('blogsCtrl', function ($scope, $rootScope, $cookies, $timeout, $state, toastr, blogs, user) {
    $cookies.get('SessionToken') && user.UserInfo().then(function (resp) {
        $scope.username = resp.data.username;
    }).then(function () {
        $scope.username == $rootScope.Admin ? $scope.add = true: $scope.add = false;
    });
    $rootScope.landing_page = true;
    $scope.blogs = blogs;
    $scope.logout = function () {
        $cookies.remove('SessionToken');
        toastr.success('Success! You have logged out.', $rootScope.message_title);
        $timeout(function () {
            //$state.go('blogs.list');
            window.location.reload();
        }, 1500);
    }
});

blogModelCtrl.controller('addblogCtrl', function ($scope, $rootScope, $http, $state, $timeout, $cookies, toastr, user) {
    $cookies.get('SessionToken') && user.UserInfo().then(function (resp) {
        $scope.username = resp.data.username;
        $scope.UserId = resp.data.objectId;
    }).then(function () {
        $scope.username != $rootScope.Admin && $rootScope.back();
    });
    $rootScope.landing_page = true;
    $scope.submitForm = function (isValid) {
        if (isValid) {
            var acl = {};
            acl[$scope.UserId] = {"read": true, "write": true};
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
            $http(req).then(function successCallback(resp) {
                toastr.success('Success! You have added a blog.', $rootScope.message_title);
                $scope.blog_objId = resp.data.objectId;
                $scope.blogs.unshift({
                    'title': $scope.blog_title,
                    'content': $scope.summernote_text,
                    'createdAt': resp.data.createdAt,
                    'objectId': resp.data.objectId
                });
                $timeout(function () {
                    $state.go('blogs.detail', {'blogId': $scope.blog_objId});
                }, 1500);
            }, function errorCallback(resp) {
                toastr.error(resp.data.error, $rootScope.message_title);
            })
        }
    };
});

blogModelCtrl.controller('blogCtrl', function ($scope, $rootScope, $stateParams, $location, $anchorScroll, $http, $state, $cookies, $timeout, toastr, blogs, utils, user) {
    $rootScope.landing_page = true;
    $scope.commented = false;
    $cookies.get('SessionToken') && user.UserInfo().then(function (resp) {
        $scope.username = resp.data.username;
        $scope.UserId = resp.data.objectId;
    }).then(function () {
        $scope.username == $rootScope.Admin ? $scope.ctrl = true: $scope.ctrl = false;
    });
    $scope.blog = utils.findById($scope.blogs, $stateParams.blogId);
    $scope.blogUrl = 'https://jack614.github.io/#/blogs/' + $stateParams.blogId;
    // comments list
    var req = {
        method: 'GET',
        url: 'https://api.leancloud.cn/1.1/classes/Comment',
        headers: {
            'X-LC-Id': $rootScope.LeanCloudId,
            'X-LC-Key': $rootScope.LeanCloudKey,
            'Content-Type': 'application/json'
        },
        params: {
            'where': {'blogId': $stateParams.blogId},
            'order': '-createdAt'
        }
    };
    $http(req).then(function successCallback(resp) {
        $scope.comments = resp.data.results;
    });
    // comment submit
    $scope.submitForm = function() {
        var endValue = $scope.comment_text.lastIndexOf('</blockquote>');
        //console.log(endValue);
        //console.log($scope.comment_text.substring(endValue));
        if ($scope.comment_text == undefined) {
            toastr.error('Error! Please input your comment!', $rootScope.message_title)
        } else if ($scope.comment_text.substring(endValue).length < 20) {
            toastr.error('Error! Your comment is too short!', $rootScope.message_title)
        } else if ($scope.comment_text.replace(/<p>/g, "").replace(/<\/p>/g, "").replace(/<br>/g, "").replace(/&nbsp;/g, "") != '') {
            var acl = {};
            acl[$scope.UserId] = {"read": true, "write": true};
            acl["*"] = {"read": true};
            var req = {
                method: 'POST',
                url: 'https://api.leancloud.cn/1.1/classes/Comment',
                headers: {
                    'X-LC-Id': $rootScope.LeanCloudId,
                    'X-LC-Key': $rootScope.LeanCloudKey,
                    'Content-Type': 'application/json'
                },
                data: {
                    'username': $scope.username,
                    'blogId': $stateParams.blogId,
                    'content': $scope.comment_text,
                    'replyTo': $scope.replyTo,
                    "ACL": acl
                }
            };
            $http(req).then(function successCallback(resp) {
                toastr.success('Success! Tnanks for your comment!.', $rootScope.message_title);
                $scope.comments.unshift({
                    'content': $scope.comment_text,
                    'createdAt': resp.data.createdAt,
                    'objectId': resp.data.objectId,
                    'username': $scope.username
                });
                $scope.commented = true;
            }, function errorCallback(resp) {
                toastr.error(resp.data.error, $rootScope.message_title);
            });
        //} else if ($scope.comment_text.length > 3000) {
        //    toastr.error('Please input your comment!', $rootScope.message_title)
        } else {
            toastr.error('Error! Please input your comment!!', $rootScope.message_title)
        }
    };
    // delete comment
    $scope.delete_comment = function(objectId) {
        $scope.comment = utils.findById($scope.comments, objectId);
        $scope.username != $scope.comment.username && toastr.error('Permission deny!You can\'t delete this comment.', $rootScope.message_title);
        var req = {
            method: 'DELETE',
            url: 'https://api.leancloud.cn/1.1/classes/Comment/' + objectId,
            headers: {
                'X-LC-Id': $rootScope.LeanCloudId,
                'X-LC-Key': $rootScope.LeanCloudKey,
                'X-LC-Session': $cookies.get('SessionToken'),
                'Content-Type': 'application/json'
            }
        };
        $http(req).then(function successCallback(){
            toastr.success('Success! The comment has been deleted.', $rootScope.message_title);
            $scope.comments = utils.deletebyId($scope.comments, objectId);
            //$state.go($location.absUrl());
        }, function errorCallback(resp) {
            toastr.error(resp.data.error, $rootScope.message_title);
        });
    };
    // comment reset
    $scope.text_reset = function() {
        $scope.comment_text = undefined;
    };
    // delete blog
    $scope.delete_blog = function (objectId) {
        $scope.username != $rootScope.Admin && $rootScope.back();
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
        $http(req).then(function successCallback(){
            toastr.success('Success! The blog has been deleted.', $rootScope.message_title);
            $scope.blogs = utils.deletebyId($scope.blogs, objectId);
            $timeout(function () {
                $state.go('blogs.list');
            }, 1500);
        }, function errorCallback(resp) {
            toastr.error(resp.data.error, $rootScope.message_title);
        });
    };
    $scope.GoTo = function (id, replyTo, comment_content) {
        $scope.commented = false;
        $location.hash(id);
        $scope.replyTo = replyTo;
        var c_text = trimHtml(comment_content, { limit: 50 });
        $scope.comment_text = '<blockquote><p>' + replyTo + ' says:</p>' + c_text.html + '</blockquote><br>';
        $anchorScroll();
    };
});

blogModelCtrl.controller('editblogCtrl', function ($scope, $rootScope, $stateParams, $cookies, $http, $state, $timeout, toastr, utils, user) {
    $cookies.get('SessionToken') && user.UserInfo().then(function (resp) {
        $scope.username = resp.data.username;
    }).then(function () {
        $scope.username != $rootScope.Admin && $rootScope.back();
    });
    $rootScope.landing_page = true;
    $scope.blog = utils.findById($scope.blogs, $stateParams.blogId);
    $scope.submitForm = function(isValid) {
        if (isValid) {
            var blog_objectId = $scope.blog.objectId;
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
            $http(req).then(function successCallback() {
                toastr.success('Success! The blog has been updated.', $rootScope.message_title);
                $scope.blogs = utils.editbyId($scope.blogs, blog_objectId, $scope.blog);
                $timeout(function () {
                    $state.go('blogs.detail', {'blogId': blog_objectId});
                }, 1500);
            }, function errorCallback(resp) {
                toastr.error(resp.data.error, $rootScope.message_title);
            });
        }
    }
});