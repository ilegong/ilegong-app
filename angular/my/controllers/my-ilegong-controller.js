(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyIlegongCtrl', MyIlegongCtrl)

  /* @ngInject */
  function MyIlegongCtrl($rootScope, $scope, config){
    var vm = this;
    vm.count = 0;
    vm.showDevelopmentMode = showDevelopmentMode;

    function showDevelopmentMode(){
      vm.count = vm.count + 1;
      if(vm.count > 4){
        config.developmentMode = !config.developmentMode;
        vm.count = 0;
        $rootScope.alertMessage('显示开发者选项');
      }
    }
  } 
})(window, window.angular);