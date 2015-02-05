(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyLogCtrl', MyLogCtrl)

  /* @ngInject */
  function MyLogCtrl($rootScope, $scope, config){
    var vm = this;
    vm.clearLogs = clearLogs;

    function clearLogs(){
      $rootScope.messages = [];
    }
  } 
})(window, window.angular);