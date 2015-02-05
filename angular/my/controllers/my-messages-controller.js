(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyMessagesCtrl', MyMessagesCtrl)

  /* @ngInject */
  function MyMessagesCtrl($rootScope, $scope, config){
    var vm = this;
    vm.clearLogs = clearLogs;
    activate();
    
    function activate(){
      vm.messages = $rootScope.messages;
      $scope.$watch('messages', function(){
        vm.messages = $rootScope.messages;
      });
    }
    function clearLogs(){
      $rootScope.messages = [];
    }
  } 
})(window, window.angular);