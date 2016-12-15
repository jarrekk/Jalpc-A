/**
 * Created by Jack on 16/6/19.
 */

var blogModelService = angular.module('blogModelService', []);

blogModelService.factory('utils', function () {
    return {
        findById: function findById(a, id) {
            for (var i = 0; i < a.length; i++) {
                if (a[i].objectId == id) return a[i];
            }
            return null;
        },
        deletebyId: function deletebyId(a, id) {
            for (var i = 0; i < a.length; i++) {
                if (a[i].objectId == id) {
                    a.splice(i, 1);
                    return a;
                }
            }
            return null;
        },
        editbyId: function editbyId(a, id, obj) {
            for (var i = 0; i < a.length; i++){
                if (a[i].objectId == id) {
                    a[i] = obj;
                    return a;
                }
            }
            return null;
        }
    };
});

blogModelService.factory('deleteComment', function($rootScope, $http, toastr, utils) {
    return {
        deletebyId: function deletebyId(objectId, comments, username, sessionToken) {
            var comment = utils.findById(comments, objectId);
            if (username == comment.username || username == $rootScope.Admin) {
                //console.log($scope.comment.content.match(/http:\/\/[0-9a-zA-Z-]+.clouddn.com\/([a-zA-Z0-9]{40}).[a-zA-Z0-9]{0,5}/g));
                var ImgArray = comment.content.match(/[a-zA-Z0-9]{40}.[a-zA-Z0-9]{0,5}/g);
                if (ImgArray) {
                    var req = {
                    method: 'GET',
                    url: $rootScope.domain + '/files',
                    headers: {
                        'X-LC-Id': $rootScope.LeanCloudId,
                        'X-LC-Key': $rootScope.LeanCloudKey,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        'where': {"key": {"$in":ImgArray}}
                    }};
                    $http(req).then(function successCallback(resp) {
                        var Images = resp.data.results;
                        var ReqArray = [];
                        for (var i = 0; i < Images.length; i++) {
                            ReqArray.push({
                                "method": "DELETE",
                                "path": "/1.1/files/" + Images[i].objectId
                            });
                        }
                        var req = {
                        method: 'POST',
                        url: $rootScope.domain + '/batch',
                        headers: {
                            'X-LC-Id': $rootScope.LeanCloudId,
                            'X-LC-Key': $rootScope.LeanCloudKey,
                            'X-LC-Session': sessionToken,
                            'Content-Type': 'application/json'
                        },
                        data: {'requests': ReqArray}};
                        $http(req).then(function successCallback(resp) {
                        });
                    });
                }
                var req = {
                method: 'DELETE',
                url: $rootScope.domain + '/classes/Comment/' + objectId,
                headers: {
                    'X-LC-Id': $rootScope.LeanCloudId,
                    'X-LC-Key': $rootScope.LeanCloudKey,
                    'X-LC-Session': sessionToken,
                    'Content-Type': 'application/json'
                }};
                $http(req).then(function successCallback(){
                    toastr.success('Success! The comment has been deleted.', $rootScope.message_title);
                    comments = utils.deletebyId(comments, objectId);
                }, function errorCallback(resp) {
                    toastr.error(resp.data.error, $rootScope.message_title);
                });
            } else {
                toastr.error('Permission deny!You can\'t delete this comment.', $rootScope.message_title);
            }
            return comments;
        }
    };
});

//blogModelService.factory('blogs', function ($rootScope, $http) {
//    var req = {
//        method: 'GET',
//        url: $rootScope.domain + '/classes/Blog',
//        headers: {
//            'X-LC-Id': $rootScope.LeanCloudId,
//            'X-LC-Key': $rootScope.LeanCloudKey,
//            'Content-Type': 'application/json'
//        },
//        params: {'order': '-createdAt'}
//    };
//    var blogs = $http(req).then(function successCallback(resp){
//        return resp.data.results;
//    });
//
//    return {
//        all: function all() {
//            if (blogs) return blogs;
//            return null;
//        }
//    }
//});
