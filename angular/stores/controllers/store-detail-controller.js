(function (window, angular) {
  "use strict";

  angular.module('module.stores')
  .controller('StoreDetailCtrl', StoreDetailCtrl)

  /* @ngInject */
  function StoreDetailCtrl($rootScope, $scope, $stateParams, Stores){
    var app = this;
    activate();
    
    function activate(){
      app.storeId = $stateParams.storeId;
      Stores.getStore(app.storeId).then(function(data){
        app.store = data.content;
      });
    }
  }
})(window, window.angular);