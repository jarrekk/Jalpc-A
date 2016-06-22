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
        }
    };
});

blogModelService.factory('blogs', function ($rootScope, $http, utils) {
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
    var blogs = $http(req).then(function successCallback(resp){
        return resp.data.results;
    });

    var factory = {};
    factory.all = function () {
        return blogs;
    };
    factory.get = function (id) {
        return blogs.then(function(){
            return utils.findById(blogs, id);
        })
    };
    return factory;
});
