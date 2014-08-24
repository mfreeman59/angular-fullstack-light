'use strict';

angular.module('avInjector', [
  'ui.router',
  'ui.bootstrap',
  'ngAnimate'
])
  .config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider){

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
  })
  .run(function($rootScope, $location){

  });

