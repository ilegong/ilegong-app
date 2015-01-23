(function (window, angular) {
  "use strict";

  angular.module('module.tryings')
  .controller('TryingsCtrl', TryingsCtrl)

  /* @ngInject */
  function TryingsCtrl($rootScope, $scope, Tryings){
    var vm = this;
    activate();

    function activate(){
      Tryings.list().then(function(data){
        vm.tryings = data.cates;
      })
    }
  }
})(window, window.angular);