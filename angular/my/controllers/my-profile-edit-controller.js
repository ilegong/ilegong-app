(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyProfileEditCtrl', MyProfileEditCtrl)

  function MyProfileEditCtrl($stateParams,$scope,$rootScope,$log, $state, Profile){
    var vm = this;
    vm.saveProfile = saveProfile;
    activate();

    function activate(){
      vm.state = $stateParams.state;
      vm.profile = _.isEmpty($rootScope.user.user) ? {} : _.clone($rootScope.user.user.my_profile.User);
      vm.profileStatus = Profile.getProfileStatus(vm.state);
    }

    function saveProfile(){
      Profile.editProfile(vm.profile).then(function(){
        $rootScope.user.user.my_profile.User = _.extend($rootScope.user.user.my_profile.User, vm.profile);
        $state.go("app.my-profile");
      }, function(e){
      });
    }
    vm.confirm = function(){
      $ionicHistory.goBack();
    }
  }
})(window, window.angular);