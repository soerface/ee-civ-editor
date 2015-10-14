'use strict';

/**
 * @ngdoc function
 * @name eeCivEditorApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eeCivEditorApp
 */
angular.module('eeCivEditorApp')
  .controller('MainCtrl', function ($scope, $rootScope, $http, $timeout) {
    $scope.selectedBonuses = JSON.parse(localStorage.getItem('selectedBonuses')) || {};
    $scope.currentGame = localStorage.getItem('currentGame');
    $scope.civInfo = JSON.parse(localStorage.getItem('civInfo'));
    $scope.civilizationName = localStorage.getItem('civName') || '';
    $scope.$watch('civilizationName', function(value) {
      localStorage.setItem('civName', value);
    });
    $http({method: 'GET', url: 'civ_info.json'}).success(function(data) {
      $scope.civInfo = data;
      localStorage.setItem('civInfo', JSON.stringify(data));
    });
    $scope.selectGame = function(game) {
      $scope.currentGame = game;
      localStorage.setItem('currentGame', $scope.currentGame);
      var text = 'Unnamed Civilization';
      var originalLength = text.length;
      function typingAnimation() {
        $scope.civilizationName = $scope.civilizationName + text[0];
        text = text.slice(1, text.length);
        if (text.length > 0 && $scope.civilizationName.length + text.length === originalLength) {
          $timeout(typingAnimation, 50 + Math.random() * 300);
        }
        $scope.focusCivName = true;
      }
      $timeout(typingAnimation, 1000);
    };
    $scope.toggleAvailableCategory = function(category) {
      $scope.civInfo.categories[category].show = !$scope.civInfo.categories[category].show;
    };
    $scope.addBonus = function(category, bonus) {
      $scope.selectedBonuses[category] = $scope.selectedBonuses[category] || [];
      $scope.selectedBonuses[category].push(bonus);
      localStorage.setItem('selectedBonuses', JSON.stringify($scope.selectedBonuses));
    };
    $scope.removeBonus = function(category, bonus) {
      var index = $scope.selectedBonuses[category].indexOf(bonus);
      $scope.selectedBonuses[category].splice(index, 1);
      if ($scope.selectedBonuses[category].length === 0) {
        delete $scope.selectedBonuses[category];
      }
      localStorage.setItem('selectedBonuses', $scope.selectedBonuses);
    };
    $scope.getExtraCosts = function(categoryName, n) {
      var category = $scope.selectedBonuses[categoryName];
      if (category === undefined) {
        return 0;
      }
      n = n === undefined ? category.length : n;
      return n * $scope.civInfo.categories[categoryName].category_cost; // jshint ignore:line
    };
    $scope.getCosts = function(bonus, categoryName, n) {
      return bonus.costs + $scope.getExtraCosts(categoryName, n);
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
        if ($scope.selectedBonuses.hasOwnProperty(category)) {
          sum += $scope.getSelectedCosts(category);
        }
      }
      return sum;
    };
    $scope.getPointsLeft = function() {
      return 100 - $scope.getTotalCosts();
    };
    function getSelectedBonuses() {
      var bonuses = [];
      for (var category in $scope.selectedBonuses) {
        if ($scope.selectedBonuses.hasOwnProperty(category)) {
          // TODO: maybe implement lodash sometime...
          for (var bonus in $scope.selectedBonuses[category]) {
            if ($scope.selectedBonuses[category].hasOwnProperty(bonus)) {
              bonuses.push($scope.selectedBonuses[category][bonus]);
            }
          }
        }
      }
      return bonuses;
    }
    function generateBlob() {
      var bonuses = getSelectedBonuses();
      var byteArray = new Uint8Array(4 + $scope.civilizationName.length + 4 + bonuses.length * 4);
      var byteArrayPos = 0;
      byteArray[byteArrayPos] = $scope.civilizationName.length;
      byteArrayPos += 4;
      for (var x = 0; x < $scope.civilizationName.length; x++){
        byteArray[byteArrayPos] = $scope.civilizationName.charCodeAt(x);
        byteArrayPos += 1;
      }

      byteArray[byteArrayPos] = bonuses.length;
      byteArrayPos += 4;
      for (var bonus in bonuses) {
        if (bonuses.hasOwnProperty(bonus)) {
          byteArray[byteArrayPos] = parseInt(bonuses[bonus].hexcode.substr(0, 2), 16);
          byteArrayPos++;
          byteArray[byteArrayPos] = parseInt(bonuses[bonus].hexcode.substr(2, 2), 16);
          byteArrayPos++;
          byteArrayPos += 2;
        }
      }
      return new Blob([byteArray], {type: 'application/octet-stream'});
    }
    $scope.downloadCiv = function() {
      var a = document.createElement('a');
      var blob = generateBlob();
      a.href = window.URL.createObjectURL(blob);
      a.target = '_blank';
      a.download = $scope.civilizationName + '.civ';
      a.click();
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
