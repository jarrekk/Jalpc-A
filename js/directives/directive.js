/**
 * Created by Jack on 16/6/18.
 */

// var appDirective = angular.module('appModelDirective', []);
//
// appDirective.directive('passwordcheck', function () {
//     return {
//         require: 'ngModel',
//         link: function (scope, elem, attrs, ctrl) {
//             var matchCheck = attrs.matchCheck;
//             var param = matchCheck.split('|');
//             var inputCtr = '#' + param[0];
//             elem.bind(inputCtr).on('keyup', function () {
//                 scope.$apply(function () {
//                     var v = elem.val() === $(inputCtr).val();
//                     scope.resetpasswordForm[param[1]].$setValidity('match', v);
//                 });
//             });
//         }
//     }
// });