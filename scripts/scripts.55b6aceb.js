"use strict";angular.module("eeCivEditorApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("eeCivEditorApp").controller("MainCtrl",["$scope","$http","$timeout",function(a,b,c){function d(){var b=[];for(var c in a.selectedBonuses)if(a.selectedBonuses.hasOwnProperty(c))for(var d in a.selectedBonuses[c])a.selectedBonuses[c].hasOwnProperty(d)&&b.push(a.selectedBonuses[c][d]);return b}function e(){var b=d(),c=new Uint8Array(4+a.civilizationName.length+4+4*b.length),e=0;c[e]=a.civilizationName.length,e+=4;for(var f=0;f<a.civilizationName.length;f++)c[e]=a.civilizationName.charCodeAt(f),e+=1;c[e]=b.length,e+=4;for(var g in b)b.hasOwnProperty(g)&&(c[e]=parseInt(b[g].hexcode.substr(0,2),16),e++,c[e]=parseInt(b[g].hexcode.substr(2,2),16),e++,e+=2);return new Blob([c],{type:"application/octet-stream"})}a.selectedBonuses={},a.civilizationName="",b({method:"GET",url:"civ_info.json"}).success(function(b){a.civInfo=b}),a.selectGame=function(b){function d(){a.civilizationName=a.civilizationName+e[0],e=e.slice(1,e.length),e.length>0&&a.civilizationName.length+e.length===f&&c(d,50+300*Math.random()),a.focusCivName=!0}a.currentGame=b;var e="Unnamed Civilization",f=e.length;c(d,1e3)},a.toggleAvailableCategory=function(b){a.civInfo.categories[b].show=!a.civInfo.categories[b].show},a.addBonus=function(b,c){a.selectedBonuses[b]=a.selectedBonuses[b]||[],a.selectedBonuses[b].push(c)},a.removeBonus=function(b,c){var d=a.selectedBonuses[b].indexOf(c);a.selectedBonuses[b].splice(d,1),0===a.selectedBonuses[b].length&&delete a.selectedBonuses[b]},a.getExtraCosts=function(b,c){var d=a.selectedBonuses[b];return void 0===d?0:(c=void 0===c?d.length:c,c*a.civInfo.categories[b].category_cost)},a.getCosts=function(b,c,d){return b.costs+a.getExtraCosts(c,d)},a.getSelectedCosts=function(b){var c=a.selectedBonuses[b],d=0;for(var e in c)c.hasOwnProperty(e)&&(d+=a.getCosts(c[e],b,e));return d},a.getTotalCosts=function(){var b=0;for(var c in a.selectedBonuses)a.selectedBonuses.hasOwnProperty(c)&&(b+=a.getSelectedCosts(c));return b},a.getPointsLeft=function(){return 100-a.getTotalCosts()},a.downloadCiv=function(){var b=document.createElement("a"),c=e();b.href=window.URL.createObjectURL(c),b.target="_blank",b.download=a.civilizationName+".civ",b.click()}}]).directive("focusMe",function(){return{link:function(a,b,c){a.$watch(c.focusMe,function(d){d===!0&&(b[0].focus(),a[c.focusMe]=!1)})}}});