(function (window, angular) {
  "use strict";

  angular.module('ilegong.my', [])
  .controller('MyCtrl', MyCtrl)

  /* @ngInject */
  function MyCtrl($scope){
  	$scope.UserInfo = new UserInfo('Lilei');

  }

})(window, window.angular);