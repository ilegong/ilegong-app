(function ($window, angular, cordova, navigator) {
  "use strict";

  angular.module('module.my')
  .controller('MyIlegongCtrl', MyIlegongCtrl)

  /* @ngInject */
  function MyIlegongCtrl($rootScope, $scope, $log, $timeout, config){
    var vm = this;
    vm.toggleLogMode = toggleLogMode;
    activate();

    function activate(){
      vm.count = 0;
      vm.logMode = $rootScope.config.logMode;
      vm.version = $rootScope.config.app.version;

      $scope.$watch('config.logMode', function() {
        vm.logMode = $rootScope.config.logMode;
      });
      $scope.$watch('config.app.version', function() {
        vm.version = $rootScope.config.app.version;
      });
    }
    function toggleLogMode(){
      vm.count = vm.count + 1;
      if(vm.count > 4){
        config.logMode = !config.logMode;
        vm.count = 0;
        $rootScope.alertMessage(config.logMode ? '显示开发者选项' : '隐藏开发者选项');
      }
    }
  } 
})(window, window.angular, window.cordova, window.navigator);