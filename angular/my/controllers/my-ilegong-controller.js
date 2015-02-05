(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyIlegongCtrl', MyIlegongCtrl)

  /* @ngInject */
  function MyIlegongCtrl($rootScope, $scope, config){
    var vm = this;
    vm.count = 0;
    vm.toggleLog = toggleLog;

    function toggleLog(){
      vm.count = vm.count + 1;
      if(vm.count > 4){
        config.showLog = !config.showLog;
        vm.count = 0;
        $rootScope.alertMessage('显示开发者选项');
      }
    }
  } 
})(window, window.angular);