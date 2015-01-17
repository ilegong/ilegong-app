(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyProfileCtrl', MyProfileCtrl)

  /* @ngInject */
  function MyProfileCtrl($scope, $rootScope, $log, $state, Users){
    var vm = this;
    vm.logout = logout;
    activate();

    function activate() {
      Users.getUser().then(function(user){
        vm.user = user.my_profile.User;
        vm.trying = user.my_profile.Shichituan;
      });
      $scope.$watch('user.user', function(newUser, oldUser) {
        $log.log("user has changed to :").log(newUser);
        vm.user = newUser.my_profile.User;
      });
    }

    function logout(){
      Users.logout().then(function(){
        $state.go('app.my');
      });
    }
  }
})(window, window.angular);