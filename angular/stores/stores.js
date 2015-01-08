(function (window, angular) {
  "use strict";

  angular.module('ilegong.stores', ['app.services'])
  .controller('StoresCtrl', StoresCtrl)
  .controller('StoreCtrl', StoreCtrl)
  .controller('StoreHomeCtrl', StoreHomeCtrl)
  .controller('StoreIntroCtrl', StoreIntroCtrl)

  /* @ngInject */
  function StoresCtrl($rootScope, $scope, Stores){
    var vm = this;
    activate();
    
    function activate(){
      Stores.list().then(function(data){
        vm.stores = data.brands;
        console.log(vm.stores);
      });
    }
  }

  /* @ngInject */
  function StoreCtrl($rootScope, $scope, $stateParams, Stores){
    var app = this;
    activate();
    
    function activate(){
      app.storeId = $stateParams.storeId;
      Stores.getStore(app.storeId).then(function(data){
        app.store = data.content;
      });
    }
  }

  /* @ngInject */
  function StoreHomeCtrl($rootScope, $scope, $stateParams, Stores){
    var vm = this;
    vm.storeId = $stateParams.storeId;
    activate();

    function activate(){
    }
  }

  /* @ngInject */
  function StoreIntroCtrl($rootScope, $scope, $stateParams, $sce, Stores){
    var vm = this;
    activate();
    
    function activate(){
      Stores.getStoreIntro($stateParams.storeId).then(function(data){
        vm.storeIntro = $sce.trustAsHtml(data.Brand.content);
      });
    }
  }
})(window, window.angular);