(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyIlegongCtrl', MyIlegongCtrl)

  /* @ngInject */
  function MyIlegongCtrl($rootScope, $scope, config){
    var vm = this;
    vm.toggleDevelopmentMode = toggleDevelopmentMode;
    activate();

    function activate(){
      vm.count = 0;
      vm.developmentMode = $rootScope.config.developmentMode;
      $scope.$watch('config.developmentMode', function() {
        vm.developmentMode = $rootScope.config.developmentMode;
      });
    }
    function toggleDevelopmentMode(){
      vm.count = vm.count + 1;
      if(vm.count > 4){
        config.developmentMode = !config.developmentMode;
        vm.count = 0;
        $rootScope.alertMessage(config.developmentMode ? '显示开发者选项' : '隐藏开发者选项');
      }
    }
  } 
})(window, window.angular);