(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyMessageCtrl', MyMessageCtrl)

  /* @ngInject */
  function MyMessageCtrl($rootScope, $scope, $stateParams, config){
    var vm = this;
    activate();
    
    function activate(){
      vm.message = $rootScope.messages[$stateParams.id];
    }
  } 
})(window, window.angular);