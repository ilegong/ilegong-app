(function (window, angular) {
  "use strict";

  angular.module('ilegong.my', ['app.services'])
  .controller('MyCtrl', MyCtrl)
  .controller('MyDetailCtrl',MyDetailCtrl)

  .controller('MyAccountLoginCtrl', MyAccountLoginCtrl)
  .controller('MyAccountRegisterCtrl', MyAccountRegisterCtrl)
  .controller('MyIlegongCtrl', MyIlegongCtrl)

  .controller('MyAddressesInfoCtrl',MyAddressesInfoCtrl)
  .controller('MyCouponsCtrl',MyCouponsCtrl)
  .controller('MyOffersCtrl',MyOffersCtrl)
  .controller('MyOrdersCtrl',MyOrdersCtrl)

  .controller('MyOrderDetailCtrl',MyOrderDetailCtrl)

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
        vm.user = user.my_profile.User;
        vm.trying = user.my_profile.Shichituan;
        vm.loggedIn = !_.isEmpty(vm.user);
      });
    }
  }
  /* @ngInject */
  function MyAccountLoginCtrl($rootScope, $scope){
    $rootScope.hideTabs = true;
  }
  /* @ngInject */
  function MyAccountRegisterCtrl($rootScope, $scope){
    $rootScope.hideTabs = true;
  }
  /* @ngInject */
  function MyIlegongCtrl($rootScope, $scope){
    $rootScope.hideTabs = true;
  }


  function MyDetailCtrl($scope,$rootScope,$http,UserDetail){
    var vm = this;
    active();
    
    function active()
    {
      UserDetail.list(1).then(function(data){
        vm.my_profile = data.my_profile;

      })
    }
  }
  
  function MyAddressesInfoCtrl($scope,$rootScope,Orders,Addresses)
  {

    var vm = this;
    active();
    $rootScope.hideTabs = true;
    
    $scope.accessEditVisible=false;

    $scope.values={accessEditVisible:false, editAddress:null,addressSelectedIndex:-1,addressEditIndex:-2};
    $scope.values.setEditAddress=function(index)
    {
      $scope.values.addressEditIndex = index;
      if(index==-1)
      {
        $scope.values.editAddress=new AddressItem('','','','','','','','',-1,-1,-1);
        vm.provinceModel = null;
        vm.cityModel = null;
        vm.countyModel = null;
        vm.cities = null;
        vm.counties = null;
        return;
      }
      if(index>=0)
      {
        var t=vm.addresses[index];

        $scope.values.editAddress=t;
        var provinceId = $scope.values.editAddress.OrderConsignees.province_id;
        var cityId = $scope.values.editAddress.OrderConsignees.city_id;
        var countyId = $scope.values.editAddress.OrderConsignees.county_id;
       
        for(var zzz in vm.provinces)
        {
          if(vm.provinces[zzz].id == provinceId)
          {
            
            vm.provinceModel = vm.provinces[zzz];
            break;
          }
        }

        Addresses.getAddress(provinceId,cityId,countyId).then(function(data){
          var ct = data.city_list;
          vm.cities = Array();
          for(var zzz in ct)
          {
            var t = {'id':zzz,'name':ct[zzz]};
            vm.cities.push(t);
            if(zzz == cityId)
            {
              vm.cityModel = t; 
            }
          }
          ct = data.county_list;
          vm.counties = Array();
          for(var zzz in ct)
          {

            var t = {'id':zzz,'name':ct[zzz]};
            vm.counties.push(t);
            if(zzz == countyId)
            {

              vm.countyModel = t;
            }
          }


        })
        /*
         var r = $rootScope.getRegion_1_model(t.region_1);
         
        $scope.values.editAddress.region_1_model = r.content;
        var r2 = $rootScope.getReion_2_model(r.id,t.region_2);
                  
        $scope.values.editAddress.region_2_model = r2.content;
        var r3 = $rootScope.getRegion_3_model(r.id,r2.id,t.region_3);
                 
        $scope.values.editAddress.region_3_model = r3.content;
        */
        return;

      }
    }



    $scope.values.deleteAddressItem=function(index)
    {
      vm.addresses.splice(index,1);
    }
    $scope.values.getDefColor=function(index)
    {
      if($scope.addresses[index].def==true)
      {
        return '#eeeeee';
      }
      return 'white'; 
    }
    $scope.values.setDef=function(index)
    {
      var i =0;
      while(i<$scope.addresses.length)
      {
        $scope.addresses[i].def= false;
        i++;
      }
      $scope.addresses[index].def=true;
    }


    function active()
    {
  
      vm.provinces = $rootScope.allProvince();
      Addresses.list(1).then(function(data)
      {
        vm.addresses = data;
        
      
      })
      

    }
    vm.getCities = function(id)
    {
      if(id==null)
      {
        vm.cities = null;
        vm.counties = null;
        return;
      }

      vm.cities = $rootScope.getCities(id);
 

        
    }
    vm.getCounties = function(id)
    {
      
      if(id == null)
      {
        vm.counties = null;
        return;

      }
      vm.counties = $rootScope.getCounties(id);
 
    }

    vm.confirm = function()
    {
      var index = $scope.values.addressEditIndex;
      var t = $scope.values.editAddress.OrderConsignees;
      if(t.name !='' && t.name!=null && 
        vm.provinceModel != null &&
        vm.cityModel!=null && 
        vm.countyModel != null && 
        t.address != '' && t.address != null && 
        t.mobilephone != '' && t.mobilephone != null)
      {
        if(index == -1)
          console.log('confirm create')
        else if(index >=0)
          console.log('confirm change');
        //confirm
      }
    }
  }
  function MyCouponsCtrl($scope,$rootScope,Coupons)
  {
    $rootScope.hideTabs = true;
    var vm = this;
    active();

    function active()
    {
      Coupons.list(1).then(function(data){
        vm.coupons = data.coupons;
        var brandsT = data.brands;  
        vm.brands = Array();
        for(var zzz in brandsT)
        {
          vm.brands[zzz] = brandsT[zzz];
        }
        
      })
    }
  }
  function MyOffersCtrl($scope,$rootScope,$http,Offers)
  {
    $rootScope.hideTabs = true;
    var vm = this;
    active();
    function active()
    {
      Offers.list(1).then(function(data){
        vm.sharedOffers = data.sharedOffers;
        vm.expiredIds = data.expiredIds;
        vm.soldOuts = data.soldOuts;
        var brandsT = data.brands;
        vm.brands = Array();
        for(var zzz in brandsT)
        {

          vm.brands[zzz] = brandsT[zzz];
      
        }

      });

    }
  }
  function MyOrdersCtrl($scope,$rootScope,$http,Orders){
  
    $rootScope.hideTabs = true;
    var vm = this;
    active();
    
    vm.stateFilter = -1;
    function active()
    {
 
      Orders.list().then(function(data){
        vm.orders = data.orders;
        vm.brands = data.brands;
        vm.order_carts = data.order_carts;
        vm.ship_type = data.ship_type;
      });
    }
  }

  function MyOrderDetailCtrl($scope,$rootScope,$http,OrderDetail)
  {
    var vm = this;
    active();
    
    $scope.getTotalPrice = function()
    {
      var sum = 0;
      for(var key in vm.carts)
      {
        sum+=Number(vm.carts[key].Cart.price);
      }
      return sum;
    }
    function active()
    {
      OrderDetail.list().then(function(data)
      {
        vm.order = data.order;
        vm.carts = data.carts;
        vm.ship_type = data.ship_type;
        vm.expired_pids = data.expired_pids;
        vm.no_more_money = data.no_more_money;
        vm.products = data.products;
      })
    }
  }   
})(window, window.angular);