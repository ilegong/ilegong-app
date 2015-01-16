(function ($window, angular) {
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
  function MyCtrl($q,$state,$rootScope, $scope, $log, Users){
    var vm = this;
    vm.profileClick = profileClick;
    activate();

    function activate() {
      console.log("afad");
      vm.loggedIn = false;
      Users.getUser().then(function(user){
        vm.loggedIn = true;
        vm.user = user.my_profile.User;
        vm.trying = user.my_profile.Shichituan;
      });
    }
    function profileClick(){
      $rootScope.myMain.defer = $q.defer();
      $rootScope.myMain.defer.promise.then(function(result){
        activate();
      })
      if(vm.loggedIn){
        $state.go("app.my-detail");
      }
      else{
        $state.go("app.my-account-login");
      }
    }
  }
  /* @ngInject */
  function MyDetailCtrl($scope, $rootScope, $log, $state, Users){
    var vm = this;
    vm.logout = logout;
    activate();

    function activate() {
      Users.getUser().then(function(user){
        vm.user = user.my_profile.User;
        vm.trying = user.my_profile.Shichituan;
        console.log(vm.user);
      });
    }

    function logout(){
      Users.logout().then(function(){
        $rootScope.myMain.defer.resolve(null);
        $state.go('app.my');
      });
    }
  }

  function MyDetailEditCtrl($stateParams,$scope,$rootScope,$log,Profile){
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
  function MyAccountLoginCtrl($ionicHistory,$rootScope, $scope, $state, $log, Users){
    var vm = this;
    vm.username = "";
    vm.password = "";
    vm.login = login;

    function login(){
      Users.login(vm.username, vm.password).then(function(){
        $rootScope.myMain.defer.resolve(null);
        $ionicHistory.goBack();
      }, function(error){
        $log.log('login failed: ' + error.status).log(error.data);
      })
    }
  }
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

  /* @ngInject */
  function MyIlegongCtrl($rootScope, $scope){
  }

  function MyAddressesInfoCtrl($q,$state,$ionicHistory,$stateParams,$log,$scope,$rootScope,Orders,Addresses){
    var vm = this;
    vm.state = $stateParams.state;
    vm.addrId = $stateParams.addrId;
    vm.itemClick = itemClick;
    vm.setDefaultAddress = setDefaultAddress;
    vm.editAddress = editAddress;
    vm.getEditText = getEditText;
    activate();

    function activate() {
      Addresses.getProvinces().then(function(provinces){
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
          vm.editAddress(addr);
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
          console.log($rootScope.cart);
          $rootScope.cart['setAddressDefer'].resolve(addr);
          $ionicHistory.goBack();
        }
      }

    }
    function editAddress(addr){
      $rootScope['editAddress'] = {};
      $rootScope['editAddress']['defer'] = $q.defer();
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
      $rootScope['editAddress']['defer'].promise.then(function(data){
        activate();
      })
    }

    vm.isChecked = function(addr){
      if(vm.state == 0){
        return addr.OrderConsignees.status == 1;
      }
      if(vm.state == 1){
        return vm.addrId == addr.OrderConsignees.id;
      }
    }

    function setDefaultAddress(id){
      Addresses.def(id).then(function(result){
        activate();
      })
    }
  }
  function MyCouponsCtrl($scope,$rootScope,Coupons) {
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
    var vm = this;
    vm.isOfferValid = function(offer){return Offers.isOfStates(offer, ['NEW', 'GOING'])};
    vm.getOfferDesc = function(offer){return Offers.getOfferStatus(offer).desc};
    activate();
    function activate() {
      Offers.list().then(function(data){
        vm.sharedOffers = data.sharedOffers;
        vm.expiredIds = data.expiredIds;
        vm.soldOuts = data.soldOuts;
        vm.brands = _.map(data.brands, function(brand){return brand});
      });
    }
  }
  function MyOrdersCtrl($log,$scope,$rootScope,$http,Orders){
    var vm = this;
    vm.getOrderDesc = function(order){return Orders.getOrderStatus(order).desc};
    vm.isOfStates = vm.isOfState = function(order, states){return Orders.isOfStates(order, states)};
    activate();
    
    vm.stateFilter = '';
    function activate() {
      Orders.list().then(function(data){
        vm.orders = data.orders;
        vm.brands = data.brands;
        vm.order_carts = data.order_carts;
        vm.ship_type = data.ship_type;
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

  function MyOrderDetailCtrl($scope, $rootScope, $http, $stateParams, $log, $state, Orders, Users) {
    var vm = this;
    vm.getOrderDesc = function(order){return Orders.getOrderStatus(order).desc};
    vm.isOfStates = vm.isOfState = function(order, states){return Orders.isOfStates(order, states)};
    vm.aliPay = aliPay;
    vm.onAliPayLoadStart = onAliPayLoadStart;
    vm.onAliPayLoadStop = onAliPayLoadStop;
    vm.onAliPayFinished = onAliPayFinished;
    activate();
    
    function activate() {
      vm.orderId = $stateParams.id;
      vm.inAppBrowserEvents = {'loadstart': vm.onAliPayLoadStart, 'loadstop': vm.onAliPayLoadStop, 'exit': vm.onAliPayFinished}
      Orders.getOrderDetail(vm.orderId).then(function(data) {
        vm.order = data.order;
        vm.cartItems = data.carts;
        vm.totalPrice = _.reduce(vm.cartItems, function(sum, cartItem){return sum + cartItem.Cart.price}, 0);
        vm.ship_type = data.ship_type;
        vm.expired_pids = data.expired_pids;
        vm.no_more_money = data.no_more_money;
        vm.products = data.products;
      });
    }
    function aliPay(){
      Users.aliPay(vm.orderId).then(function(inAppBrowser){
        vm.inAppBrowser = inAppBrowser;
        _.each(vm.inAppBrowserEvents, function(callback, event){
          vm.inAppBrowser.addEventListener(event, callback);  
        });
      }, function(e){$log.log(e)});
    }
    function onAliPayLoadStart(e){
    }
    function onAliPayLoadStop(e){
      if(e.url.match("/ali_pay/wap_return_back_app")){
        $log.log("will close in app browser...");
        vm.inAppBrowser.close();
      }
    }
    function onAliPayFinished(e){
      _.each(vm.inAppBrowserEvents, function(callback, event){
        try{
          vm.inAppBrowser.removeEventListener(event, callback);  
        }catch(e){$log.log("failed to remove event listener " + event).log(e)}
      });
      $log.log("ali pay finished, will reload order detail for order " + vm.orderId);
      $window.location.reload(true)
    }
  }

  function MyAddressEditCtrl($ionicHistory,$log,$scope,$rootScope,$stateParams,Addresses, Orders){
    var vm = this;
    vm.addAddress = addAddress;
    vm.editAddress = editAddress;
    vm.deleteAddress = deleteAddress;
    vm.onProvinceChanged = onProvinceChanged;
    vm.onCityChanged = onCityChanged;
    activate();
    function activate(){
      var addressId = $stateParams.editId;  
      vm.cities = vm.counties = [];
      vm.province = vm.city = vm.county = {};
      Addresses.getProvinces().then(function(provinces){
        vm.provinces = provinces;
      });      
      if(addressId == -1){
        return;
      }
      Addresses.getAddressById(addressId).then(function(address){
        vm.address = address;
        vm.province = _.find(vm.provinces, function(province){return province.id == vm.address.OrderConsignees.province_id});

        var orderConsignees = vm.address.OrderConsignees;        
        Addresses.getAddress(corderConsignees.province_id, orderConsignees.city_id, corderConsignees.county_id).then(function(data){
          vm.cities = data.city_list;
          vm.city = _.find(vm.cities, function(city){return city.id == vm.address.OrderConsignees.city_id});
          vm.counties = data.county_list;
          vm.county = _.find(vm.counties, function(county){return county.id == vm.address.OrderConsignees.county_id});
        });
      });
    }
    function onProvinceChanged(province){
      vm.cities = vm.counties = [];
      if(_.isEmpty(province)){
        return;
      }
      Addresses.getCities(province.id).then(function(cities){
        vm.cities = cities;
      });
    }
    function onCityChanged(city) {
      vm.counties = [];
      if(_.isEmpty(city)){
        return;
      }
      Addresses.getCounties(city.id).then(function(counties){
        vm.counties = counties;
      });
    }
    vm.save = function(){
      var promise;
      if(_.isEmpty(vm.address.OrderConsignees.id)){
        promise = vm.addAddress();
      }
      else{
        promise = vm.editAddress(vm.address.OrderConsignees.id);
      }
      promise.then(function(data){
        $rootScope['editAddress']['defer'].resolve(null);
        $ionicHistory.goBack();
      })

      
    }
    function editAddress(){
      var t = vm.address.OrderConsignees;
      return Addresses.editAddress(t.id,t.name,t.address,vm.province.id,vm.city.id,vm.county.id,t.mobilephone);
    }
    function addAddress(){
      var t = vm.address.OrderConsignees;
      return Addresses.addAddress(t.name,t.address,vm.province.id,vm.city.id,vm.county.id,t.mobilephone);
    }
    function deleteAddress(addressId){
      Addresses.deleteAddress(addressId).then(function(data){
        $rootScope['editAddress']['defer'].resolve(null);
        $ionicHistory.goBack();
      });
    }
  }   
})(window, window.angular);