(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyProfileCtrl', MyProfileCtrl)

  /* @ngInject */
  function MyProfileCtrl($scope, $rootScope, $log, $state, Base){
    var vm = this;
    vm.logout = logout;
    activate();

    function activate() {
      vm.user = $rootScope.user.profile.User;
      $scope.$watch('user.profile', function(newProfile, oldProfile) {
        vm.user = newProfile.User;
      });
    }

    function logout(){
      Base.removeLocal('token').then(function(){
        $rootScope.onUserLoggedOut();
        $state.go("app.my");
      });
    }
  }
})(window, window.angular);