(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyProfileEditCtrl', MyProfileEditCtrl)

  function MyProfileEditCtrl($stateParams,$scope,$rootScope,$log,Profile){
    var vm = this;

    activate();

    function activate(){
      vm.state = $stateParams.state;
      vm.sex = -1;

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

    vm.getContent = function(){
      if(vm.state == 'portrait')
        return '头像';
      if(vm.state == 'nickname')
        return '昵称';
      if(vm.state == 'sex')
        return '性别';
      if(vm.state == 'company')
        return '单位';
      if(vm.state == 'bio')
        return '个性签名';
      return '?';
    }
  }
})(window, window.angular);