(function (window, angular) {
  "use strict";

  angular.module('ilegong.products', [])
  .controller('ProductDetailCtrl', ProductDetailCtrl)

  /* @ngInject */
  function ProductDetailCtrl($rootScope, $scope, $stateParams,$http,Products){

    $rootScope.hideTabs = true;
    var vm = this;
    vm.count=1;
    active();

    function active(){
      var id = $stateParams.id;

      Products.getProduct(id).then(
        function(data)
        {
          vm.product = data.product;
          vm.recommends = data.recommends;
          vm.brand = data.brand;
        
        }
        );

    }
    


    $scope.buttonReduceClick = function()
    {
      if(vm.count > 1)
        vm.count=Number(vm.count)-1;
    };
    $scope.buttonAddClick = function()
    {
      vm.count=Number(vm.count)+1;
    };
    $scope.getRankText = function(rank)
    {
      if(rank=='A')
        return '好评';
      if(rank=='B')
        return '中评';
      if(rank=='C')
        return '差评';
    }
    $scope.getRankColor = function(rank)
    {
      if(rank=='A')
        return 'green';
      if(rank=='B')
        return 'gray';
      if(rank=='C')
        return 'red';
    }

  }


})(window, window.angular);