/**
 * Created by Jack on 16/6/17.
 */


var rootApp = angular.module('rootApp', [
    'indexModelCtrl',
    'userModelCtrl',
    'blogModelCtrl',
    'blogModelService',
    'uiRouter',
    'uiRouter.blogs',
    'summernote',
    'ui.router',
    'ngCookies',
    'toastr',
])
.run(function ($rootScope, $state, $stateParams, $anchorScroll) {
    $rootScope.message_title = 'Celine Blog';
    $rootScope.AdminId = '5764eff42e958a00581a6fd2';
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.LeanCloudId = 'vAMFua5yim32gEb0BgyaUPtw-gzGzoHsz';
    $rootScope.LeanCloudKey = 'nsyfA4qrY3UQsOe7JP6xvUxo';
    $rootScope.$on("$stateChangeSuccess",  function(event, toState, toParams, fromState, fromParams) {
        $rootScope.previousState_name = fromState.name;
        $rootScope.previousState_params = fromParams;
        $anchorScroll();
    });
    $rootScope.back = function() {
        $state.go($rootScope.previousState_name,$rootScope.previousState_params);
    };
})
.config(['$interpolateProvider', function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{$');
    $interpolateProvider.endSymbol('$}');
}]);

rootApp.controller('rootCtrl', function ($rootScope) {
    $rootScope.landing_page = false;
    $rootScope.gray_bg = false;
});

angular.module('uiRouter', ['ui.router'])
.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('index', {
            url: '/',
            templateUrl: 'tpls/index.html',
            controller: 'indexCtrl'
        })
        .state('user', {
            url: '/user',
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
            templateUrl: 'tpls/user/login.html',
            controller: 'loginCtrl'
        })
        .state('user.register', {
            url: '/register',
            templateUrl: 'tpls/user/register.html',
            controller: 'registerCtrl'
        })
        .state('user.forgotpassword', {
            url: '/forgot_password',
            templateUrl: 'tpls/user/forgot_password.html',
            controller: 'forgotpasswordCtrl'
        })
        .state('user.resetpassword', {
            url: '/reset_password',
            templateUrl: 'tpls/user/reset_password.html',
            controller: 'resetpasswordCtrl'
        })
});

angular.module('uiRouter.blogs', ['ui.router', 'ngSanitize'])
.config(function ($stateProvider, $urlRouterProvider) {
    // $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('blogs', {
            // abstract: true,
            url: '/blogs',
            templateUrl: 'tpls/blog/blog.html',
            controller: 'blogsCtrl'
            // resolve: {
            //     blogs: ['blogs',
            //         function (blogs) {
            //             return blogs.all();
            //         }]
            // },
            // controller:
            //     function ($scope, $rootScope, blogs) {
            //         $rootScope.landing_page = true;
            //         $scope.blogs = blogs;
            //     }
        })
        .state('blogs.add', {
            url: '/add',
            templateUrl: 'tpls/blog/blog_add.html',
            controller: 'addblogCtrl'
        })
        .state('blogs.detail', {
            url: '/{blogId:[0-9a-z]{24}}',
            templateUrl: 'tpls/blog/blog_detail.html',
            controller: 'blogCtrl'
        })
        .state('blogs.edit', {
            url: '/edit/{blogId:[0-9a-z]{24}}',
            templateUrl: 'tpls/blog/blog_edit.html',
            controller: 'editblogCtrl'
        })
});
