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
        console.log(vm.user);
      });
    }

    function logout(){
      Users.logout().then(function(){
        $state.go('app.my');
      });
    }
  }
})(window, window.angular);