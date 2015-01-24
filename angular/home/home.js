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
        vm.tryingItems = data.tryingItems;
        vm.specTagItems = data.specTagItems;
        vm.mainTagItems = data.mainTagItems;
        vm.hotItems = data.hotItems;
        //vm.brands = data.brands;
        //vm.tagsWithProducts = data.tagsWithProducts;
      });
    }
  }
})(window, window.angular);