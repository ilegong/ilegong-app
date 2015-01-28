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
      Products.list().then(function(data){
        vm.bannerItems = _.filter(data.bannerItems, function(item){return item.id != null});
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