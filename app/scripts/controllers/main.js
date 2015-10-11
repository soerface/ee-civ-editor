'use strict';

/**
 * @ngdoc function
 * @name eeCivEditorApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eeCivEditorApp
 */
angular.module('eeCivEditorApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.currentGame = 'ee'; // or 'aoe'
    $scope.selectedBonuses = {};
    $http({method: 'GET', url: '/civ_info.json'}).success(function(data, status, headers, config) {
      $scope.civInfo = data;
    });
    $scope.toggleAvailableCategory = function(category) {
      $scope.civInfo['categories'][category].show = !$scope.civInfo['categories'][category].show
    };
    $scope.addBonus = function(category, bonus) {
      $scope.selectedBonuses[category] = $scope.selectedBonuses[category] || [];
      $scope.selectedBonuses[category].push(bonus);
    };
    $scope.removeBonus = function(category, bonus) {
      var index = $scope.selectedBonuses[category].indexOf(bonus);
      $scope.selectedBonuses[category].splice(index, 1);
      if ($scope.selectedBonuses[category].length === 0) {
        delete $scope.selectedBonuses[category];
      }
    };
  });
