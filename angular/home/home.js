(function (window, angular) {
  "use strict";

  angular
  .module('ilegong.home', ['app.services'])
  .controller('HomeCtrl', HomeCtrl)
  
  /* @ngInject */
  function HomeCtrl($rootScope, $scope, $http, $log, Products){
    var vm = this;
    active();

    function active(){
      Products.list().then(function(data){
        vm.bannerItems = data.bannerItems;
        vm.brands = data.brands;
        vm.tagsWithProducts = data.tagsWithProducts;
      });
    }
  }
})(window, window.angular);