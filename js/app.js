/**
 * Created by Jack on 16/6/17.
 */

var rootApp = angular.module('rootApp', [
    'ui.router',
    'ngCookies',
    'ngAnimate',
    //'ngResource',
    'toastr',
    'oc.lazyLoad'
])
.run(function ($rootScope, $state, $stateParams, $http, $location, $anchorScroll, $cookies, toastr) {
    $rootScope.LeanCloudId = 'vAMFua5yim32gEb0BgyaUPtw-gzGzoHsz';
    $rootScope.LeanCloudKey = 'nsyfA4qrY3UQsOe7JP6xvUxo';
    $rootScope.domain = 'https://api.leancloud.cn/1.1';
    $rootScope.message_title = 'Celine Blog';
    $rootScope.Admin = 'Celine';
    $rootScope.AdminId = '5764eff42e958a00581a6fd2';
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$on("$stateChangeSuccess",  function(event, to, toParams, from, fromParams) {
        var github_callback = $location.absUrl().match(/code=(\w{20})/i);
        if (github_callback !== null && !$cookies.get('SessionToken')) {
            //var url =  "http://localhost:3000/api/github?code=" + github_callback[1] + "&callback=JSON_CALLBACK";
            var url =  "http://jalpc-a.leanapp.cn/api/github?code=" + github_callback[1] + "&callback=JSON_CALLBACK";
            $http.jsonp(url).success(function (data) {
                if (data.status == 200) {
                    var username = 'gh_' + data.login;
                    var req = {
                    method: 'POST',
                    url: $rootScope.domain + '/users',
                    headers: {
                        'X-LC-Id': $rootScope.LeanCloudId,
                        'X-LC-Key': $rootScope.LeanCloudKey,
                        'Content-Type': 'application/json'
                    },
                    data: {
                        "authData": {
                            "github": {"uid": data.id.toString(), "username": username}
                        }
                    }};
                    $http(req).then(function successCallback(resp){
                        $cookies.put('SessionToken', resp.data.sessionToken);
                        toastr.success('Welcome Github user! ' + username, $rootScope.message_title);
                    }, function errorCallback(resp){
                        toastr.error(resp.data.error, $rootScope.message_title);
                    });
                }
            });
        }
        from.name && $cookies.put('PreviousStateName', from.name);
        fromParams && $cookies.put('PreviousParamsName', JSON.stringify(fromParams));
        //$location.hash('top');
        $anchorScroll();
    });
    $rootScope.back = function() {
        $state.go($cookies.get('PreviousStateName'), JSON.parse($cookies.get('PreviousParamsName')));
    };
})
.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{$');
    $interpolateProvider.endSymbol('$}');
})
.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('index', {
            url: '/',
            data:{ pageTitle: 'Index' },
            templateUrl: 'tpls/index.html',
            controller: 'indexCtrl',
            resolve: {
                loadMyService: function($ocLazyLoad) {
                    return $ocLazyLoad.load(['js/controllers/index.js']);
                }}
        })
        .state('user', {
            url: '/user',
            data:{ pageTitle: '' },
            template: '<div ui-view></div>',
            // controller: function ($state, $rootScope) {
            // $rootScope.currentUser = AV.User.current();
            // console.log($rootScope.currentUser.getEmail());
            // if ($rootScope.sessionToken) {$state.go('user.resetpassword');}
            // else {$state.go('user.login');}
            // }
        })
        .state('user.login', {
            url: '/login',
            data:{ pageTitle: 'Login' },
            templateUrl: 'tpls/user/login.html',
            controller: 'loginCtrl',
            resolve: {
                loadMyService: function($ocLazyLoad) {
                    return $ocLazyLoad.load('js/controllers/user.js');
                }}
        })
        .state('user.register', {
            url: '/register',
            data:{ pageTitle: 'Register' },
            templateUrl: 'tpls/user/register.html',
            controller: 'registerCtrl',
            resolve: {
                loadMyService: function($ocLazyLoad) {
                    return $ocLazyLoad.load('js/controllers/user.js');
                }}
        })
        .state('user.forgotpassword', {
            url: '/forgot_password',
            data:{ pageTitle: 'Forgot password' },
            templateUrl: 'tpls/user/forgot_password.html',
            controller: 'forgotpasswordCtrl',
            resolve: {
                loadMyService: function($ocLazyLoad) {
                    return $ocLazyLoad.load('js/controllers/user.js');
                }}
        })
        .state('user.resetpassword', {
            url: '/reset_password',
            data:{ pageTitle: 'Reset password' },
            templateUrl: 'tpls/user/reset_password.html',
            controller: 'resetpasswordCtrl',
            resolve: {
                loadMyService: function($ocLazyLoad) {
                    return $ocLazyLoad.load(['js/controllers/user.js', 'js/services/user.js']);
                }}
        })
        .state('blogs', {
            abstract: true,
            // url: '/blogs',
            url: '/blogs/{page:[0-9]{0,3}}',
            templateUrl: 'tpls/blog/blog.html',
            controller: 'blogsCtrl',
            resolve: {
                loadMyService: function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'js/controllers/blog.js',
                        'js/services/blog.js',
                        'js/controllers/user.js',
                        'js/services/user.js',
                        'bower_components/angular-sanitize/angular-sanitize.min.js',
                        'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
                        //'bower_components/angular-animate/angular-animate.min.js',
                        'js/trimHtml.js'
                    ]);
                },
            }
        })
        .state('blogs.add', {
            url: '/add',
            data:{ pageTitle: 'Add blog' },
            templateUrl: 'tpls/blog/blog_add.html',
            controller: 'addblogCtrl',
            resolve: {
                loadMyService: function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'bower_components/summernote/dist/summernote.css',
                        'bower_components/angular-summernote/dist/angular-summernote.min.js',
                        'bower_components/summernote/dist/summernote.min.js'
                    ]);
                }}
        })
        .state('blogs.detail', {
            url: '/{blogId:[0-9a-z]{24}}',
            data:{ pageTitle: 'Blog' },
            templateUrl: 'tpls/blog/blog_detail.html',
            controller: 'blogCtrl',
            resolve: {
                loadMyService: function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'bower_components/sweetalert/dist/sweetalert.css',
                        'bower_components/jquery-ui/themes/base/jquery-ui.min.css',
                        'bower_components/jquery-ui/jquery-ui.min.js',
                        'bower_components/summernote/dist/summernote.css',
                        'bower_components/angular-summernote/dist/angular-summernote.min.js',
                        'bower_components/summernote/dist/summernote.min.js',
                        'bower_components/qrcode-generator/js/qrcode.js',
                        //'bower_components/qrcode-generator/js/qrcode_UTF8.js',
                        'bower_components/angular-qrcode/angular-qrcode.js',
                        'bower_components/sweetalert/dist/sweetalert.min.js',
                        'bower_components/ngSweetAlert/SweetAlert.min.js'
                    ]);
                }}
        })
        .state('blogs.edit', {
            url: '/edit/{blogId:[0-9a-z]{24}}',
            data:{ pageTitle: 'Edit blog' },
            templateUrl: 'tpls/blog/blog_edit.html',
            controller: 'editblogCtrl',
            resolve: {
                loadMyService: function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'bower_components/summernote/dist/summernote.css',
                        'bower_components/angular-summernote/dist/angular-summernote.min.js',
                        'bower_components/summernote/dist/summernote.min.js'
                    ]);
                }}
        })
        .state('blogs.list', {
            url: '',
            data:{ pageTitle: 'Blogs' },
            templateUrl: 'tpls/blog/blog_list.html',
            controller: 'bloglistCtrl'
        });
});
rootApp.filter("sanitize", function($sce) {
    return function(htmlCode){
    return $sce.trustAsHtml(htmlCode);
    };
});
rootApp.controller('rootCtrl', function ($rootScope) {
    $rootScope.landing_page = false;
    $rootScope.gray_bg = false;
});
