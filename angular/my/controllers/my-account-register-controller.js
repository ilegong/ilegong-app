(function ($window, angular) {
  "use strict";

  angular.module('module.my')
  .controller('MyAccountRegisterCtrl', MyAccountRegisterCtrl)

  /* @ngInject */
  function MyAccountRegisterCtrl($rootScope, $scope, $log, $state, $interval, $timeout, Base, Users){
    var vm = this;
    vm.showCaptchaCode = showCaptchaCode;
    vm.verifyCaptchaCode = verifyCaptchaCode;
    vm.shouldDisableSmsCodeButton = shouldDisableSmsCodeButton;
    vm.shouldEnableRegisterButton = shouldEnableRegisterButton;
    vm.getSmsCode = getSmsCode;
    vm.register = register;

    activate();

    function activate(){
      vm.user = {mobile: '', captchaCode: '', smsCode: '', password: '', isCaptchaCodeValid: false, smsSent: false, nextSentInterval: 60};
      vm.timer = null;
      vm.registerErrors = {
        1: '数据格式不对', 
        2: '该手机号之前已注册', 
        3: '服务器错误', 
        4: '短信验证码错误，请重试', 
        5: '手机号与验证码不一致，请重试' 
      }
      vm.showCaptchaCode();
    }

    function isBlank(str){
      return (!str || /^\s*$/.test(str));
    }
    
    function showCaptchaCode(){
      var captchaImage = document.getElementById("captchaImage");
      captchaImage.src = Users.getCaptchaImageUrl();
    }

    function verifyCaptchaCode(){
      Users.verifyCaptchaCode(vm.user.captchaCode).then(function(data){
        vm.user.isCaptchaCodeValid = true;  
      }, function(e){
        vm.showCaptchaCode(); 
      });
    }
    
    function shouldDisableSmsCodeButton(){
      return !Base.isMobileValid(vm.user.mobile) || !vm.user.isCaptchaCodeValid || vm.user.smsSent;
    }

    function getSmsCode(){
      vm.user.smsSent = true;
      Users.getSmsCode(vm.user.mobile, vm.user.captchaCode).then(function(data){
        $log.log('get sms code, set smsSent to true');
        vm.user.smsSent = true;
        vm.user.nextSentInterval = 60;
        vm.timer = $interval(function(){
          vm.user.nextSentInterval = vm.user.nextSentInterval - 1;
          if(vm.user.nextSentInterval <= 0){
            $log.log('timer finished, smsSent set to false');
            vm.timer = null;
            vm.user.smsSent = false;
            vm.showCaptchaCode();
          }
        }, 1000, 60)
      }, function(e){
        vm.user = {mobile: vm.user.mobile, captchaCode: '', smsCode: '', password: '', isCaptchaCodeValid: false, smsSent: false, nextSentInterval: 60};
        vm.showCaptchaCode();
        $rootScope.alertMessage('验证码错误，请重试');
      })
    }

    function shouldEnableRegisterButton(){
      return Base.isMobileValid(vm.user.mobile) && vm.user.isCaptchaCodeValid && !Base.isBlank(vm.user.smsCode) && !Base.isBlank(vm.user.password);
    }

    function register(){
      $log.log('to register');
      Users.register(vm.user.mobile, vm.user.password, vm.user.smsCode).then(function(data){
        $state.go('app.my');
      }, function(e){
        if(!_.isEmpty(vm.timer)){
          $log.log('cancel timer');
          $interval.cancel(vm.timer);
        }
        $rootScope.alertMessage(vm.registerErrors[e.data.error] || "注册失败，请稍后再试");
        vm.user = {mobile: vm.user.mobile, captchaCode: '', smsCode: '', password: '', isCaptchaCodeValid: false, smsSent: false, nextSentInterval: 60};
        vm.showCaptchaCode();
      });
    }
  }
})(window, window.angular);