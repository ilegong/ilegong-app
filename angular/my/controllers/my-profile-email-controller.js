(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyProfileEmailCtrl', MyProfileEmailCtrl)

  function MyProfileEmailCtrl($stateParams,$scope,$rootScope,$log, $state, Base, Profile){
    var vm = this;
    vm.saveProfile = saveProfile;
    vm.verifyEmail = verifyEmail;
    vm.isEmailValid = isEmailValid;
    activate();

    function activate(){
      vm.email = _.isEmpty($rootScope.user.user) ? '' : $rootScope.user.user.my_profile.User.email;
    }

    function saveProfile(){
      Profile.editProfile(_.extend($rootScope.user.user.my_profile.User, {email: vm.email})).then(function(){
        $rootScope.user.user.my_profile.User.email = vm.email;
        $state.go("app.my-profile");
      }, function(e){
      }); 
    }

    function verifyEmail(){
      if(!vm.isEmailValid(vm.email)){
        $rootScope.alertMessage("邮箱输入错误");
      }
      else{
        $rootScope.alert.message = "";
      }
    }
    function isEmailValid(email){
      if(_.isEmpty(email)){
        return false;
      }
      return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email);
    }
  }
})(window, window.angular);