(function (window, angular) {
  "use strict";

  angular.module('module.stores')
  .controller('StoreCtrl', StoreCtrl)

  /* @ngInject */
  function StoreCtrl($rootScope, $scope, $state, $stateParams, Stores){
    var app = this;
    app.toStoreHomePage = toStoreHomePage;
    app.toStoreIntroPage = toStoreIntroPage;
    activate();
    
    function activate(){
      app.storeId = $stateParams.id;
      app.storeName = $stateParams.name;
      $rootScope.hideStoreTabs = [];
    }
    function toStoreHomePage(){
      $rootScope.hideStoreTabs = [];
      $state.go('store.home', {id: app.storeId, name: app.storeName});
    }
    function toStoreIntroPage(brand){
      $rootScope.hideStoreTabs = [];
      $state.go('store.intro', {id: app.storeId, name: app.storeName});
    }
  }
})(window, window.angular);