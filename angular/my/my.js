(function (window, angular) {
  "use strict";

  angular.module('ilegong.my', [])
  .controller('MyCtrl', MyCtrl)
  .controller('MyAccountCtrl', MyAccountCtrl)
  .controller('MyIlegongCtrl', MyIlegongCtrl)

  /* @ngInject */
  function MyCtrl($scope){
  	$scope.UserInfo = new UserInfo('Lilei');
  }
  /* @ngInject */
  function MyAccountCtrl($scope){
  }
  /* @ngInject */
  function MyIlegongCtrl($scope){
  }

})(window, window.angular);