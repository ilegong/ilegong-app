(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyProfileEditCtrl', MyProfileEditCtrl)

  function MyProfileEditCtrl($stateParams,$scope,$rootScope,$log,Profile){
    var vm = this;
    activate();

    function activate(){
      vm.state = $stateParams.state;
      vm.profile = _.isEmpty($rootScope.user.user) ? {} : $rootScope.user.user.my_profile.User;
      vm.profileStatus = Profile.getProfileStatus(vm.state);
      $log.log("vm.state: " + vm.state +", profile status: ").log(vm.profileStatus);
    }

    vm.confirm = function(){
      if(vm.state == 'portrait'){
        Profile.edit(null,vm.text,null,null,null);
      }
      if(vm.state == 'nickname'){
        Profile.edit(vm.text,null,null,null,null);
      }
      if(vm.state == 'sex'){
        if(vm.sex != -1){
          Profile.edit(null,null,vm.sex,null,null); 
        }
      }
      if(vm.state == 'bio'){
        Profile.edit(null,null,null,vm.text,null);
      }
      if(vm.state == 'company'){
        Profile.edit(null,null,null,null,vm.text);
      }
      $ionicHistory.goBack();
    }
  }
})(window, window.angular);