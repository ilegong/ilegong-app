(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyLogCtrl', MyLogCtrl)

  /* @ngInject */
  function MyLogCtrl($rootScope, $scope, config){
    var vm = this;
    vm.clearLogs = clearLogs;
    activate();
    
    function activate(){
      vm.logs = $rootScope.messages;
      $scope.$watch('messages', function(){
        vm.logs = $rootScope.messages;
      });
    }
    function clearLogs(){
      $rootScope.messages = [];
    }
  } 
})(window, window.angular);