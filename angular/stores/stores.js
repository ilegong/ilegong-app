(function (window, angular) {
  "use strict";

  angular.module('ilegong.stores', ['app.services'])
  .controller('StoresCtrl', StoresCtrl)
  .controller('StoreCtrl', StoreCtrl)
  .controller('StoreHomeCtrl', StoreHomeCtrl)
  .controller('StoreIntroCtrl', StoreIntroCtrl)

  /* @ngInject */
  function StoresCtrl($rootScope, $scope, Stores){
    $rootScope.hideTabs = false;
    var vm = this;
    activate();
    
    function activate(){
      Stores.list().then(function(data){
        vm.stores = data.brands;
      });
    }
  }

  /* @ngInject */
  function StoreCtrl($rootScope, $scope, $stateParams, Stores){
    $rootScope.hideTabs = false;
    var app = this;
    activate();
    
    function activate(){
      app.storeId = $stateParams.id;
      Stores.getStore(app.storeId).then(function(data){
        app.store = data.content;
      });
    }
  }

  /* @ngInject */
  function StoreHomeCtrl($rootScope, $scope, $stateParams, Stores){
    $rootScope.hideTabs = false;
    var vm = this;
    activate();

    function activate(){
    }
  }

  /* @ngInject */
  function StoreIntroCtrl($rootScope, $scope, $stateParams, $sce, Stores){
    $rootScope.hideTabs = false;
    var vm = this;
    activate();
    
    function activate(){
      Stores.getStoreIntro($stateParams.id).then(function(data){
        vm.storeIntro = $sce.trustAsHtml(data.Brand.content);
      });
    }
  }
})(window, window.angular);