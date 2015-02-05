(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyProfileSexCtrl', MyProfileSexCtrl)

  function MyProfileSexCtrl($stateParams,$scope,$rootScope,$log, $state, Base, Profile){
    var vm = this;
    vm.saveProfile = saveProfile;
    activate();

    function activate(){
      if(_.isEmpty($rootScope.user.profile)){
        vm.sex = 1;
      }
      else if(typeof($rootScope.user.profile.User.sex) != 'number'){
        vm.sex = 1;
      }
      else{
        vm.sex = $rootScope.user.profile.User.sex;
      }
    }

    function saveProfile(){
      if(!$rootScope.user.loggedIn){
        return $state.go('account-login');
      }
      Profile.editProfile(_.extend($rootScope.user.profile.User, {sex: vm.sex}), $rootScope.user.token.access_token).then(function(){
        $rootScope.user.profile.User.sex = vm.sex;
        $state.go("app.my-profile");
      }, function(e){
      }); 
    }
  }
})(window, window.angular);