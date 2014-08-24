'use strict';

angular.module('avInjector')
  .config(function ($stateProvider){
    $stateProvider
      .state('girls', {
        url: '/',
        templateUrl: 'app/girls/girls.html',
        controller: 'GirlsCtrl'
      });
  });

