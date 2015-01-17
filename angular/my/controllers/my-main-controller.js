(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyMainCtrl', MyMainCtrl)

  /* @ngInject */
  function MyMainCtrl($q,$state,$rootScope, $scope, $log, Users){
    var vm = this;
    vm.profileClick = profileClick;
    activate();

    function activate() {
      console.log("afad");
      vm.loggedIn = false;
      Users.getUser().then(function(user){
        vm.loggedIn = true;
        vm.user = user.my_profile.User;
        vm.trying = user.my_profile.Shichituan;
      });
    }
    function profileClick(){
      $rootScope.myMain.defer = $q.defer();
      $rootScope.myMain.defer.promise.then(function(result){
        activate();
      })
      if(vm.loggedIn){
        $state.go("app.my-detail");
      }
      else{
        $state.go("app.my-account-login");
      }
    }
  } 
})(window, window.angular);