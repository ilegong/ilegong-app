(function (window, angular) {
  "use strict";

  angular.module('ilegong.my', ['app.services','ionic'])
  .controller('MyCtrl', MyCtrl)
  .controller('MyDetailCtrl',MyDetailCtrl)
  .controller('MyDetailEditCtrl',MyDetailEditCtrl)

  .controller('MyAccountLoginCtrl', MyAccountLoginCtrl)
  .controller('MyAccountRegisterCtrl', MyAccountRegisterCtrl)
  .controller('MyIlegongCtrl', MyIlegongCtrl)

  .controller('MyAddressesInfoCtrl',MyAddressesInfoCtrl)
  .controller('MyCouponsCtrl',MyCouponsCtrl)
  .controller('MyOffersCtrl',MyOffersCtrl)
  .controller('MyOrdersCtrl',MyOrdersCtrl)

  .controller('MyOrderDetailCtrl',MyOrderDetailCtrl)
  .controller('MyAddressEditCtrl',MyAddressEditCtrl)
  /* @ngInject */
  function MyCtrl($rootScope, $scope, $log, Users){
  	$rootScope.hideTabs = false;
    var vm = this;
    active();

    function active() {
      vm.loggedIn = false;
      Users.getToken().then(function(token){
        vm.token = token;
      });
      Users.getUser().then(function(user){
        vm.loggedIn = true;
        vm.user = user.my_profile.User;
        vm.trying = user.my_profile.Shichituan;
      });
    }
  }
  /* @ngInject */
  function MyDetailCtrl($scope, $rootScope, $log, $state, Users){
    $rootScope.hideTabs = true;
    var vm = this;
    vm.logout = logout;
    active();

    function active() {
      Users.getUser().then(function(user){
        vm.user = user.my_profile.User;
        vm.trying = user.my_profile.Shichituan;
        console.log(vm.user);
      });
    }

    function logout(){
      Users.logout().then(function(){
        $state.go('app.my');
      });
    }
  }

  function MyDetailEditCtrl($stateParams,$scope,$rootScope,$log,Profile){
    $rootScope.hideTabs = true;
    var vm = this;

    active();

    function active(){
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
  
  /* @ngInject */
  function MyAccountLoginCtrl($rootScope, $scope, $state, $log, Users){
    $rootScope.hideTabs = true;
    var vm = this;
    vm.username = "";
    vm.password = "";
    vm.login = login;

    function login(){
      Users.login(vm.username, vm.password).then(function(){
        $state.go('app.my');
      }, function(error){
        $log.log('login failed: ' + error.status).log(error.data);
      })
    }
  }
  /* @ngInject */
  function MyAccountRegisterCtrl($rootScope, $scope, $log, $state, $interval, $timeout, Users){
    $rootScope.hideTabs = true;
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

  /* @ngInject */
  function MyIlegongCtrl($rootScope, $scope){
    $rootScope.hideTabs = true;
  }


  

  function MyAddressesInfoCtrl($state,$ionicHistory,$stateParams,$log,$scope,$rootScope,Orders,Addresses){
    $rootScope.hideTabs = true;
    var vm = this;
    vm.state = $stateParams.state;
    vm.addrId = $stateParams.addrId;
    vm.itemClick = itemClick;
    vm.setDefaultAddress = setDefaultAddress;
    vm.editAddress = editAddress;
    vm.getEditText = getEditText;
    active();

    function active() {
      Orders.getProvinces().then(function(provinces){
        vm.provinces = provinces;
      })
      Addresses.list().then(function(data) {
        vm.addresses = data;
      })
      vm.asd=0;
      vm.editModel = false;
    }
    function getEditText(){
      return vm.editMode?'完成':'编辑';
    }

    function itemClick(addr){
      if(vm.state == 0){
        if(vm.editMode){
          vm.goAddressEdit(addr);
        }
        else{
          vm.setDefaultAddress(addr.OrderConsignees.id);
        }
      }
      else{
        if(vm.editMode){
           vm.editAddress(addr);
        }
        else{
          $rootScope.cartInfo['addressId'] = addr.OrderConsignees.id;
          $ionicHistory.goBack();
        }
      }
    }
    function editAddress(addr){
      var id = -1;
      if(addr !=null){
        id = addr.OrderConsignees.id;
      }
      if(vm.state == 0){
        $state.go('app.my-address-edit',{editId:id});

      }
      if(vm.state == 1){
        $state.go('app.order-address-edit',{editId:id});
      }
    }

    vm.isChecked = function(addr){
      if(vm.state == 0){
        return addr.OrderConsignees.status == 1;
      }
      if(vm.state == 1){
        return vm.addrId == addr.OrderConsignees.id;
      }
    }
    vm.del = function(id){
      Addresses.del(id);
      active();
    }

    function setDefaultAddress(id){
      Addresses.def(id).then(function(result){
        active();
      })
    }
  }
  function MyCouponsCtrl($scope,$rootScope,Coupons) {
    $rootScope.hideTabs = true;
    var vm = this;
    vm.couponStates = [
      {state:1, value:'有效', available: true},
      {state:1, value:'可用', available: true},
      {state:2, value:'已使用', available: false}
    ];
    vm.getCouponValue = getCouponValue;
    vm.isCouponAvailable = isCouponAvailable;

    activate();

    function activate() {
      Coupons.getCoupons().then(function(data){
        vm.coupons = data.coupons;
        vm.brands = _.map(data.brands, function(brand){return brand});
      })
    }
    function getCouponValue(state){
      return _.find(vm.couponStates, function(couponState){return couponState.state == state}).value;
    }
    function isCouponAvailable(state){
      return _.any(vm.couponStates, function(couponState){return couponState.state == state && couponState.available == true});
    }
  }
  function MyOffersCtrl($scope,$rootScope,$http,Offers) {
    $rootScope.hideTabs = true;
    var vm = this;
    active();
    function active() {
      Offers.list().then(function(data){
        vm.sharedOffers = data.sharedOffers;
        vm.expiredIds = data.expiredIds;
        vm.soldOuts = data.soldOuts;
        vm.brands = _.map(data.brands, function(brand){return brand});
      });
    }
  }
  function MyOrdersCtrl($log,$scope,$rootScope,$http,Orders){
    $rootScope.hideTabs = true;
    var vm = this;
    activate();
    
    vm.stateFilter = -1;
    function activate() {
      Orders.list().then(function(data){
        vm.orders = data.orders;
        vm.brands = data.brands;
        vm.order_carts = data.order_carts;
        vm.ship_type = data.ship_type;
        for(var i=0;i<30;i++){
          $log.log('qqqq');
        }
      });
    }
    vm.undo = function(id){
      Orders.undo(id).then(function(result){
        activate();
      });
      
    }
    vm.remove = function(id){
      Orders.remove(id).then(function(result){
        activate();
        $log.log(result);
      });
    }
    vm.receive = function(id){
      Orders.receive(id).then(function(result){
        activate();
      });
    }

  }

  function MyOrderDetailCtrl($scope,$rootScope,$http,$stateParams,OrderDetail) {
    var vm = this;
    active();
    
    $scope.getTotalPrice = function() {
      var sum = 0;
      for(var key in vm.carts) {
        sum+=Number(vm.carts[key].Cart.price);
      }
      return sum;
    }
    function active() {
      OrderDetail.list($stateParams.id).then(function(data) {
        console.log('sdf');
        console.log(data);
        vm.order = data.order;
        vm.carts = data.carts;
        vm.ship_type = data.ship_type;
        vm.expired_pids = data.expired_pids;
        vm.no_more_money = data.no_more_money;
        vm.products = data.products;
      })
    }
  }
  function MyAddressEditCtrl($ionicHistory,$log,$scope,$rootScope,$stateParams,Addresses, Orders){
    var vm = this;

    vm.editId = $stateParams.editId;
    activate();

    function activate(){
      Orders.getProvinces().then(function(provinces){
        vm.provinces = provinces;
      });
      
      if(vm.editId == -1){
        vm.provinceModel = null;
        vm.cityModel = null;
        vm.countyModel = null;
        vm.cities = null;
        vm.counties = null;
        return;

      }
      if(vm.editId>=0){
        Addresses.list().then(function(data) {
          for(var i in data){
            if(data[i].OrderConsignees.id == vm.editId){
              vm.editAddr = data[i];
              break;
            }
          }
               for(var i=0;i<30;i++)
        $log.log('a');
          var t=vm.editAddr;
          var provinceId = t.OrderConsignees.province_id;
          var cityId = t.OrderConsignees.city_id;
          var countyId = t.OrderConsignees.county_id;
          for(var zzz in vm.provinces){
           
            if(vm.provinces[zzz].id == provinceId){
       
              vm.provinceModel = vm.provinces[zzz];
              break;
            }
          }
          
          
          Addresses.getAddress(provinceId,cityId,countyId).then(function(data){
            var ct = data.city_list;
            vm.cities = Array();
            for(var zzz in ct){
              var t = {'id':zzz,'name':ct[zzz]};
              vm.cities.push(t);
              if(zzz == cityId){
                vm.cityModel = t; 
              }
            }
            ct = data.county_list;
            vm.counties = Array();
            for(var zzz in ct){
              var t = {'id':zzz,'name':ct[zzz]};
              vm.counties.push(t);
              if(zzz == countyId){
                vm.countyModel = t;
              }
            }
          })
        })
      }
    }
    vm.getCities = function(id) {
      if(id==null) {
        vm.cities = null;
        vm.counties = null;
        return;
      }
      vm.cities = $rootScope.getCities(id);
    }
    vm.getCounties = function(id) {
      if(id == null) {
        vm.counties = null;
        return;
      }
      vm.counties = $rootScope.getCounties(id);
    }
    vm.save = function(){
      if(vm.editId == -1){
        vm.add();
      }
      else{
        vm.edit(id);
      }
      active();
      $ionicHistory.goBack();
    }
    vm.edit = function(){
      var t = vm.editAddr.OrderConsignees;
      Addresses.edit(t.id,t.name,t.address,vm.provinceModel.id,vm.cityModel.id,vm.countyModel.id,t.mobilephone);
    }
    vm.add = function(){
      var t = vm.editAddr.OrderConsignees;
      Addresses.add(t.name,t.address,vm.provinceModel.id,vm.cityModel.id,vm.countyModel.id,t.mobilephone);
    }

  }   
})(window, window.angular);