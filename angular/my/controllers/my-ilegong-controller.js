(function ($window, angular, cordova, navigator) {
  "use strict";

  angular.module('module.my')
  .controller('MyIlegongCtrl', MyIlegongCtrl)

  /* @ngInject */
  function MyIlegongCtrl($rootScope, $scope, $log, $timeout, config){
    var vm = this;
    vm.toggleDevelopmentMode = toggleDevelopmentMode;
    activate();

    function activate(){
      vm.count = 0;
      vm.developmentMode = $rootScope.config.developmentMode;
      vm.version = $rootScope.config.app.version;

      $scope.$watch('config.developmentMode', function() {
        vm.developmentMode = $rootScope.config.developmentMode;
      });
      $scope.$watch('config.app.version', function() {
        vm.version = $rootScope.config.app.version;
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
})(window, window.angular, window.cordova, window.navigator);