(function (window, angular) {
  "use strict";

  angular.module('ilegong.brands', ['app.services'])
  .controller('BrandsCtrl', BrandsCtrl)
  .controller('BrandCtrl', BrandCtrl)
  .controller('BrandHomeCtrl', BrandHomeCtrl)
  .controller('BrandIntroCtrl', BrandIntroCtrl)

  /* @ngInject */
  function BrandsCtrl($rootScope, $scope, Brands){
    $rootScope.hideTabs = false;
    var vm = this;
    activate();
    
    function activate(){
      Brands.list().then(function(data){
        vm.brands = data.brands;
      });
    }
  }

  /* @ngInject */
  function BrandCtrl($rootScope, $scope, $stateParams, Brands){
    $rootScope.hideTabs = false;
    var app = this;
    activate();
    
    function activate(){
      Brands.getBrand($stateParams.id).then(function(data){
        app.brand = data.content;
      });
    }
  }

  /* @ngInject */
  function BrandHomeCtrl($rootScope, $scope, $stateParams, Brands){
    $rootScope.hideTabs = false;
    var vm = this;
    activate();

    function activate(){
    }
  }

  /* @ngInject */
  function BrandIntroCtrl($rootScope, $scope, $stateParams){
    $rootScope.hideTabs = true;
    console.log('in brand intro ctrl');
    activate();
    
    function activate(){
      Brands.getBrand($stateParams.id).then(function(data){
        vm.brand = data.content;
      });
    }
  }
})(window, window.angular);