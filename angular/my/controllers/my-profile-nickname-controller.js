(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyProfileNickNameCtrl', MyProfileNickNameCtrl)

  function MyProfileNickNameCtrl($stateParams,$scope,$rootScope,$log, $state, Base, Profile){
    var vm = this;
    vm.saveProfile = saveProfile;
    vm.isNickNameValid = isNickNameValid;
    activate();

    function activate(){
      vm.nickname = _.isEmpty($rootScope.user.profile) ? '' : $rootScope.user.profile.User.nickname;
    }

    function saveProfile(){
      if(!$rootScope.user.loggedIn){
        return $state.go('account-login');
      }

      Profile.editProfile(_.extend($rootScope.user.profile.User, {nickname: vm.nickname}), $rootScope.user.token.access_token).then(function(){
        $rootScope.user.profile.User.nickname = vm.nickname;
        $state.go("my-profile");
      }, function(e){
      }); 
    }

    function isNickNameValid(){
      return !_.isEmpty(vm.nickname);
    }
  }
})(window, window.angular);