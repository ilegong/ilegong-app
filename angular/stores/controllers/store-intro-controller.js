(function (window, angular) {
  "use strict";

  angular.module('module.stores')
  .controller('StoreIntroCtrl', StoreIntroCtrl)

  /* @ngInject */
  function StoreIntroCtrl($rootScope, $scope, $stateParams, $sce, Stores){
    var vm = this; 
    activate();
    function activate(){
      vm.storeId = $stateParams.id;
      vm.storeName = $stateParams.name;
      Stores.getStoreIntro($stateParams.id).then(function(data){
        vm.storeIntro = $sce.trustAsHtml(data.Brand.content);
      });
    }
  }
})(window, window.angular);