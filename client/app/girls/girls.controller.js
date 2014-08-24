'use strict';

angular.module('avInjector')
  .controller('GirlsCtrl', function($scope, $http){
    $http.get('/api/girls').success(function(girls){
      $scope.girls = girls;
    });
  });

