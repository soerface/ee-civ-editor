'use strict';

/**
 * @ngdoc function
 * @name eeCivEditorApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eeCivEditorApp
 */
angular.module('eeCivEditorApp')
  .controller('MainCtrl', function ($scope, $http, $timeout) {
    $scope.selectedBonuses = {};
    $scope.civilizationName = '';
    $http({method: 'GET', url: '/civ_info.json'}).success(function(data, status, headers, config) {
      $scope.civInfo = data;
    });
    $scope.selectGame = function(game) {
      $scope.currentGame = game;
      var text = 'Unnamed Civilization';
      var originalLength = text.length;
      function typingAnimation() {
        $scope.civilizationName = $scope.civilizationName + text[0];
        text = text.slice(1, text.length);
        if (text.length > 0 && $scope.civilizationName.length + text.length == originalLength) {
          $timeout(typingAnimation, 50 + Math.random() * 300);
        }
        $scope.focusCivName = true;
      }
      $timeout(typingAnimation, 1000);
    };
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
  })
  .directive('focusMe', function() {
    return {
      link: function(scope, element, attrs) {
        scope.$watch(attrs.focusMe, function(value) {
          if(value === true) {
            console.log('value=',value);
            element[0].focus();
            scope[attrs.focusMe] = false;
          }
        });
      }
    };
  });
