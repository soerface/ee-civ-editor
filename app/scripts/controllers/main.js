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
    $scope.getExtraCosts = function(categoryName, n) {
      var category = $scope.selectedBonuses[categoryName];
      if (category === undefined) {
        return 0;
      }
      n = n === undefined ? category.length : n;
      return n * $scope.civInfo['categories'][categoryName].category_cost;
    };
    $scope.getCosts = function(bonus, categoryName, n) {
      return bonus.costs + $scope.getExtraCosts(categoryName, n)
    };
    $scope.getSelectedCosts = function(categoryName) {
      var category = $scope.selectedBonuses[categoryName];
      var sum = 0;
      for (var bonus in category) {
        if (category.hasOwnProperty(bonus)) {
          sum += $scope.getCosts(category[bonus], categoryName, bonus);
        }
      }
      return sum;
    };
    $scope.getTotalCosts = function() {
      var sum = 0;
      for (var category in $scope.selectedBonuses) {
        console.log(category);
        if ($scope.selectedBonuses.hasOwnProperty(category)) {
          sum += $scope.getSelectedCosts(category);
        }
      }
      return sum;
    };
    $scope.getPointsLeft = function() {
      return 100 - $scope.getTotalCosts();
    };
  })
  .directive('focusMe', function() {
    return {
      link: function(scope, element, attrs) {
        scope.$watch(attrs.focusMe, function(value) {
          if(value === true) {
            element[0].focus();
            scope[attrs.focusMe] = false;
          }
        });
      }
    };
  });
