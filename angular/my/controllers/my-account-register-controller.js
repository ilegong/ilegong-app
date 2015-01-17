(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyAccountRegisterCtrl', MyAccountRegisterCtrl)

  /* @ngInject */
  function MyAccountRegisterCtrl($rootScope, $scope, $log, $state, $interval, $timeout, Users){
    var vm = this;
    vm.isMobileValid = isMobileValid;
    vm.showCaptchaCode = showCaptchaCode;
    vm.verifyCaptchaCode = verifyCaptchaCode;
    vm.shouldDisableSmsCodeButton = shouldDisableSmsCodeButton;
    vm.shouldEnableRegisterButton = shouldEnableRegisterButton;
    vm.getSmsCode = getSmsCode;
    vm.register = register;
    vm.isBlank = isBlank;

    activate();

    function activate(){
      vm.user = {mobile: '', captchaCode: '', smsCode: '', password: '', isCaptchaCodeValid: false, smsSent: false, nextSentInterval: 60, registerFailed: false};
      vm.showCaptchaCode();
    }

    function isMobileValid(){
      return /^1\d{10}$/.test(vm.user.mobile);
    }
    
    function isBlank(str){
      return (!str || /^\s*$/.test(str));
    }
    
    function showCaptchaCode(){
      var captchaImage = document.getElementById("captchaImage");
      captchaImage.src = Users.getCaptchaImageUrl();
    }

    function verifyCaptchaCode(){
      $log.log("verify captcha code");
      Users.verifyCaptchaCode(vm.user.captchaCode).then(function(data){
        $log.log("captcha code is valid");
        vm.user.isCaptchaCodeValid = true;  
      }, function(e){
        vm.showCaptchaCode(); 
      });
    }
    
    function shouldDisableSmsCodeButton(){
      return !vm.isMobileValid() || !vm.user.isCaptchaCodeValid || vm.user.smsSent;
    }

    function getSmsCode(){
      Users.getSmsCode(vm.user.mobile, vm.user.captchaCode).then(function(data){
        vm.user.smsSent = true;
        vm.user.nextSentInterval = 60;
        $interval(function(){
          vm.user.nextSentInterval = vm.user.nextSentInterval - 1;
          if(vm.user.nextSentInterval <= 0){
            vm.user.smsSent = false;
          }
        }, 1000, 60)
      })
    }

    function shouldEnableRegisterButton(){
      return vm.isMobileValid() && vm.user.isCaptchaCodeValid && !vm.isBlank(vm.user.smsCode) && !vm.isBlank(vm.user.password);
    }

    function register(){
      $log.log('to register');
      Users.register(vm.user.mobile, vm.user.password, vm.user.smsCode).then(function(data){
        $log.log('register successfully:').log(data).log('----');
        $state.go('app.my');
      }, function(e){
        vm.user.registerFailed = true;
        $timeout(function(){vm.user.registerFailed = false}, 5000);
        $log.log('register error').log(e);
      });
    }
  }
})(window, window.angular);