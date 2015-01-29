(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyProfileSexCtrl', MyProfileSexCtrl)

  function MyProfileSexCtrl($stateParams,$scope,$rootScope,$log, $state, Base, Profile){
    var vm = this;
    vm.saveProfile = saveProfile;
    activate();

    function activate(){
      if(_.isEmpty($rootScope.user.user)){
        vm.sex = 1;
      }
      else if(typeof($rootScope.user.user.my_profile.User.sex) != 'number'){
        vm.sex = 1;
      }
      else{
        vm.sex = $rootScope.user.user.my_profile.User.sex;
      }
    }

    function saveProfile(){
      Profile.editProfile(_.extend($rootScope.user.user.my_profile.User, {sex: vm.sex})).then(function(){
        $rootScope.user.user.my_profile.User.sex = vm.sex;
        $state.go("app.my-profile");
      }, function(e){
      }); 
    }
  }
})(window, window.angular);