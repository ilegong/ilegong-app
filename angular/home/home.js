(function (window, angular) {
  "use strict";

  angular
  .module('ilegong.home', ['module.services'])
  .controller('HomeCtrl', HomeCtrl)
  
  /* @ngInject */
  function HomeCtrl(Users,$rootScope, $scope, $http, $log, Products){
    var vm = this;
    active();


    function active(){

      vm.date = (new Date()).valueOf();
      Products.list().then(function(data){
        vm.bannerItems = data.bannerItems;
        vm.brands = data.brands;
        vm.tagsWithProducts = data.tagsWithProducts;
      });
    }
  }
})(window, window.angular);