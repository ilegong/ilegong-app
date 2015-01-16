(function (window, angular) {
  "use strict";

  angular
  .module('ilegong.home', ['app.services'])
  .controller('HomeCtrl', HomeCtrl)
  
  /* @ngInject */
  function HomeCtrl(Users,$rootScope, $scope, $http, $log, Products){
    var vm = this;
    active();
    for(var i=0;i<30;i++)
      $log.log('avc');
    vm.clickkk = function(){
      $log.log(Users.isLoggedIn());
    }
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