'use strict';

/**
 * @ngdoc overview
 * @name eeCivEditorApp
 * @description
 * # eeCivEditorApp
 *
 * Main module of the application.
 */
angular
  .module('eeCivEditorApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
