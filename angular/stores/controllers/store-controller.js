(function (window, angular) {
  "use strict";

  angular.module('module.stores')
  .controller('StoreCtrl', StoreCtrl)

  /* @ngInject */
  function StoreCtrl($rootScope, $scope, $state, $stateParams, $log, Stores){
    var app = this;
    app.toStoreHomePage = toStoreHomePage;
    app.toStoreIntroPage = toStoreIntroPage;
    activate();
    
    function activate(){
      $rootScope.storeId = $stateParams.id;
      $rootScope.storeName = $stateParams.name;
      $rootScope.hideStoreTabs = [];
    }
    function toStoreHomePage(){
      $rootScope.hideStoreTabs = [];
      $state.go('store.home', {id: $rootScope.storeId, name: $rootScope.storeName});
    }
    function toStoreIntroPage(brand){
      $rootScope.hideStoreTabs = [];
      $state.go('store.intro', {id: $rootScope.storeId, name: $rootScope.storeName});
    }
  }
})(window, window.angular);