(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyProfileMobilePhoneCtrl', MyProfileMobilePhoneCtrl)

  function MyProfileMobilePhoneCtrl($stateParams,$scope,$rootScope,$log, $state, Base, Profile){
    var vm = this;
    vm.saveProfile = saveProfile;
    vm.verifyMobilePhone = verifyMobilePhone;
    vm.isMobilePhoneValid = isMobilePhoneValid;
    activate();

    function activate(){
      vm.mobilephone = _.isEmpty($rootScope.user.profile) ? '' : $rootScope.user.profile.User.mobilephone;
    }

    function saveProfile(){
      if(!$rootScope.user.loggedIn){
        return $state.go('account-login');
      }

      Profile.editProfile(_.extend($rootScope.user.profile.User, {mobilepone: vm.mobilephone}), $rootScope.user.token.access_token).then(function(){
        $rootScope.user.profile.User.mobilephone = vm.mobilephone;
        $state.go("app.my-profile");
      }, function(e){
      }); 
    }

    function verifyMobilePhone(){
      if(!vm.isMobilePhoneValid(vm.mobilephone)){
        $rootScope.alertMessage("手机号输入错误");
      }
      else{
        $rootScope.alert.message = "";
      }
    }
    function isMobilePhoneValid(mobilePhone){
      if(_.isEmpty(mobilePhone)){
        return false;
      }
      return /^1[3-8][0-9]\d{8}$/.test(mobilePhone.replace(/-/g, ""));
    }
  }
})(window, window.angular);