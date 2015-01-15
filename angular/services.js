(function (window, angular) {
  "use strict";

  angular
  .module('app.services', ['LocalForageModule'])
  .value('software', {fakeData: false, app: {client_id: 'NTQ5NTE5MGViMTgzMDUw', name: 'ailegong', version: ''}, server: {address: 'http://www.tongshijia.com'}})
  .service('Base', Base)
  .service('Users', Users)
  .service('Products', Products)
  .service('Orders', Orders)
  .service('Categories', Categories)
  .service("Stores", Stores)
  .service("Tryings", Tryings)
  .service("Offers", Offers)
  .service("Coupons", Coupons)
  .service('Addresses', Addresses)
  .service('Carts', Carts)
  .service('Profile', Profile)

  /* @ngInject */
  function Base($http, $q, $log, $localForage, $window, software){
    var self = this;
    self.getUrl = getUrl;
    $window.device = $window.device || {};
    return {
      get: get, 
      post: post, 
      getLocal: getLocal, 
      setLocal: setLocal, 
      removeLocal: removeLocal,
      deferred: deferred, 
      getUrl: getUrl, 
      getDevice: function(){return $window.device}
    }

    function get(url){
      if(software.fakeData){
        console.log(url);
        console.log(FakeData.get(url));
        return deferred(FakeData.get(url));
      }

      var defer = $q.defer();
      $http.get(self.getUrl(url))
        .success(function(data, status, headers, config) {
          if(status == 200){
            defer.resolve(data);
          }
          else{
            defer.reject({data: data, status: status});
          }
        })
        .error(function(data, status, headers, config) {
          $log.log("get " + url + " failed: " + status).log(data).log(config);
          defer.reject({data: data, status: status});
        });
      return defer.promise;
    }
    function post(url, data){
      if(software.fakeData){
        return deferred(FakeData.post(url));
      }
      var defer = $q.defer();
      return $http.post(self.getUrl(url), data)        
        .success(function(data, status, headers, config) {
          if(status == 200){
            defer.resolve(data);
          }
          else{
            defer.reject({data: data, status: status});
          }
        })
        .error(function(data, status, headers, config) {
          $log.log("post to " + url + " failed: " + status).log(data).log(config);
          defer.reject({data: data, status: status});
        });
      return defer.promise;
    }

    function getLocal(key){
      if(software.fakeData){
        return deferred(FakeData.getLocal(key));
      }
      return $localForage.getItem(key);
    }

    function setLocal(key, value){
      if(software.fakeData){
        return deferred(value);
      }
      return $localForage.setItem(key, value);
    }
    function removeLocal(key){
      if(software.fakeData){
        return deferred(key);
      }
      return $localForage.removeItem(key);
    }
    function getUrl(url){
      $log.log('get ' + software.server.address + url);
      return software.server.address + url;
    }
    function deferred(data){
      var defer = $q.defer();
      defer.resolve(data);
      return defer.promise;
    }
    function getLocalSync(key){
      if(software.fakeData){
        return FakeData.getLocal(key);
      }
      else{
        return $localForage.getItem(key);
      }
    }
  }

  /* @ngInject */
  function Users($log, $q, software, Base){
    var self = this;
    self.token = null;
    self.user = null;
    self.onGetTokenSuccessfully = onGetTokenSuccessfully;
    return {
      init: init,
      getToken: getToken,
      getUser: getUser,
      getCaptchaImageUrl: getCaptchaImageUrl, 
      verifyCaptchaCode: verifyCaptchaCode, 
      getSmsCode: getSmsCode, 
      register: register, 
      login: login, 
      logout: logout, 
      aliPay: aliPay
    }

    function init(){
      Base.getLocal('token').then(function(token){
        self.token = token;
        if(!_.isEmpty(self.token)){
          Base.getLocal('user').then(function(user){
            self.user = user;
          });
        }
      });
    }
    function getToken(){
      var defer = $q.defer();
      Base.getLocal('token').then(function(token){
        if(!_.isEmpty(token)){
          defer.resolve(token);
        }
        else{
          defer.reject("no local token found");
        }
      }, function(e){defer.reject(e);});
      return defer.promise;
    }
    function getUser(){
      var defer = $q.defer();
      Base.getLocal('user').then(function(user){
        if(!_.isEmpty(user)){
          defer.resolve(user);
        }
        else{
          defer.reject("no local user found");
        }
      }, function(e){defer.reject(e);});
      return defer.promise;
    }

    function login(username, password){
      var data = {grant_type: 'authorization_code', client_id: software.app.client_id, username: username, password: password}
      var defer = $q.defer();
      Base.get('/oauth/token?grant_type=password&username=' + username + '&password=' + password + '&client_id=' + software.app.client_id)
        .then(function(token) {
          $log.log("login successfully: ").log(token);
          self.onGetTokenSuccessfully(token, defer);
        }, function(error){defer.reject(error)});
      return defer.promise; 
    }

    function logout(){
      return $q.all(Base.removeLocal('token'), Base.removeLocal('user'));
    }

    function onGetTokenSuccessfully(token, defer){
      self.token = token;
      Base.setLocal('token', self.token);
      Base.get('/api_orders/my_profile.json?access_token=' + self.token.access_token).then(function(user){
        $log.log("get user successfully: ").log(user);
        self.user = user;
        Base.setLocal('user', self.user);
        defer.resolve(self.token);
      }, function(error){defer.reject(error)});
    }

    function getCaptchaImageUrl(){
      return Base.getUrl("/check/captcha?type=app&device_uuid=" + Base.getDevice().uuid);
    }

    function verifyCaptchaCode(captchaCode){
      var defer = $q.defer();
      Base.get("/check/verify?type=app&device_uuid=" + Base.getDevice().uuid + "&keyString=" + captchaCode).then(function(data){
        if(data.success){
          defer.resolve(data);
        }
        else{
          defer.reject(data);
        }
      }, function(e){
        defer.reject(e);
      });
      return defer.promise;
    }

    function getSmsCode(mobile, captchaCode){
      var defer = $q.defer();
      Base.get("/check/message_code?type=app&mobile=" + mobile + "&device_uuid=" + Base.getDevice().uuid + "&keyString=" + captchaCode).then(function(data){
        if(data.success){
          defer.resolve(data);
        }
        else{
          defer.reject(data);
        }
      }, function(e){
        defer.reject(e);
      })
      return defer.promise;
    }

    function register(mobile, password, smsCode){
      var defer = $q.defer();
      var data = {
        client_id: software.app.client_id, 
        mobile: mobile, 
        password: password, 
        code: smsCode, 
        device_uuid: Base.getDevice().uuid
      }
      var nickname = "用户" + mobile.substring(7)
      Base.get('/oauth/register?client_id=' + software.app.client_id + "&mobile=" + mobile + "&password=" + password + "&code=" + smsCode + "&device_uuid=" + Base.getDevice().uuid + "&nickname=" + nickname).then(function(token){
        self.onGetTokenSuccessfully(token, defer);
      }, function(e){defer.reject(e)});
      return defer.promise;
    }
    function aliPay(orderId){
      var defer = $q.defer();
      getUser().then(function(user){
        var userId = user.my_profile.User.id
        var url = "http://www.tongshijia.com/ali_pay/wap_to_alipay/" + orderId + "?from=app&uid=" + userId;
        var ref = window.open(url, '_blank', 'location=no');
        defer.resolve(ref);
      }, function(e){defer.reject(e)});
      return defer.promise;
    }
  }

  /* @ngInject */
  function Products($q,$log, Base,software,Users){
    var self = this;
    return {
      list: list,
      getProduct:getProduct,
      getProductContent:getProductContent,
      getProductComment:getProductComment,
      makeComment:makeComment
    }

    function list(){
      return Base.get('/categories/mobileHome.json');
    }
    function getProduct(id){
      var defer = $q.defer();
      Users.getToken().then(function(token){
        Base.get('/api_orders/product_detail/'+id+'.json?access_token='+token.access_token).then(function(product){
          defer.resolve(product);
        }, function(e){defer.reject(e)});
      }, function(e){defer.reject(e)})
      return defer.promise;
    }
    function getProductContent(id){
      return Base.get('/apiOrders/product_content/'+id+'.json')
    }
    function getProductComment(id){
      return Base.get('/comments/getlist/Product/'+id+'.json')
    }
    function makeComment(id,rating,body,pictures){

      var defer = $q.defer();
      var json = {'data_id':""+id,'type':'Product','rating':""+rating,'body':body,'pictures':pictures};
      for(var i=0;i<30;i++)
        $log.log("comment");
      $log.log(json);

      Users.getToken().then(function(token){
        Base.post('/api_orders/comment_add.json?access_token='+token.access_token,json).then(function(result){
          defer.resolve(result);
          //$log.log(result);
        })
      })
      return defer.promise;
    }
  }

  function Categories(Base){
    var self = this;
    return {
      get: get
    }

    function get(slug){
      return Base.get("/categories/tag/" + slug + ".json");
    }
  }

  function Orders($log,$q,Base,software,Users){
    var self = this;
    self.ORDER_STATUS = [
      {value: 'UNPAID', state:0, desc:'未支付'},
      {value: 'PAID', state:1, desc:'已支付'},
      {value: 'SENT', state:2, desc:'已发货'},
      {value: 'RECEIVED', state:3, desc:'已收货'},
      {value: 'REFUNDED', state:4, desc:'已退款'},
      {value: 'SUCCESSED', state:9, desc:'已完成'},
      {value: 'CANCELED', state:10, desc:'已取消'},
      {value: 'VERIFIED', state:11, desc:'已确认有效'},
      {value: 'COMPLAINED', state:12, desc:'已投诉'}
    ]
    return {
      list: list,
      getOrderStatus: getOrderStatus, 
      isOfStates: isOfStates, 
      getProvinces: getProvinces,
      getCities: getCities,
      getCounties: getCounties,
      submitOrder: submitOrder,
      undo:undo,
      remove: remove,
      receive: receive,
      getOrderDetail: getOrderDetail
    }

    function list(){
      var defer = $q.defer();
      Users.getToken().then(function(token){
        Base.get('/api_orders/mine.json?access_token='+token.access_token).then(function(item){
          defer.resolve(item);
        })
      })
      return defer.promise;
    }
    function getOrderStatus(order){
      order = order || {Order: {}}
      return _.find(self.ORDER_STATUS, function(orderStatus){return orderStatus.state == order.Order.status}) || {};
    }
    function isOfStates(order, states){
      var value = getOrderStatus(order).value;
      if(_.isArray(states)){
        return _.contains(states, value);
      }
      return value == states;
    }
    function getProvinces(){
      return Base.get('/Locations/get_province.json').then(function(provinces){
        return _.map(provinces, function(name, id){return {'id': id, 'name': name}})
      });
    }
    function getCities(id){
      return Base.get('/Locations/get_city.json?provinceId='+id).then(function(cities){
        return _.map(cities, function(name, id){return {id: id, name: name}});
      });
    }
    function getCounties(id){
      return Base.get('/Locations/get_county.json?cityId='+id).then(function(counties){
        return _.map(counties, function(name, id){return {id: id, name: name}});
      });
    }
    function submitOrder(pid_list,addressId,coupon_code,remarks){
      var json = {"pid_list":pid_list,"addressId":addressId,"coupon_code":coupon_code,"remarks":remarks};
      var defer =  $q.defer();
      Users.getToken().then(function(token){
        Base.post('/api_orders/balance.json?access_token='+token.access_token,json).then(function(result){
          if(result.data.success){
            defer.resolve(result.data.order_ids[0]);
          }
          else{
            defer.reject(result);
          }
        }, function(e){defer.reject(e)});
      }, function(e){defer.reject(e)});
      return defer.promise;
    }
    function undo(id){
      var defer = $q.defer();
      Users.getToken().then(function(token){
        Base.get('/api_orders/confirm_undo/'+id+'.json?access_token='+token.access_token).then(function(result){
          defer.resolve(result);
        }, function(e){defer.reject(e)})
      }, function(e){defer.reject(e)});
      return defer.promise;
    }
    function remove(id){
      var defer = $q.defer()
      Users.getToken().then(function(token){
        Base.get('/api_orders/confirm_remove/'+id+'.json?access_token='+token.access_token).then(function(result){
          defer.resolve(result);
        }, function(e){defer.reject(e)})
      }, function(e){defer.reject(e)});
      return defer.promise;
    }
    function receive(id){
      var defer = $q.defer();
      Users.getToken().then(function(token){
        Base.get('/api_orders/confirm_receive/'+id+'.json?access_token='+token.access_token).then(function(result){
          defer.resolve(result);
        }, function(e){defer.reject(e)})
      }, function(e){defer.reject(e)});
      return defer.promise;
    }
    function getOrderDetail(orderId){
      var defer = $q.defer();
      Users.getToken().then(function(token){
        Base.get('/apiOrders/order_detail/' + orderId + '.json?access_token='+token.access_token).then(function(item){
          defer.resolve(item);
        }, function(e){defer.reject(e)})
      }, function(e){defer.reject(e)});

      return defer.promise;
    }
  }

  /* @ngInject */
  function Stores($log, Base){
    var self = this;

    return {
      list: list, 
      getStore: getStore, 
      getStoreIntro: getStoreIntro
    }

    function list(){
      return Base.get('/api_orders/store_list.json');
    }
    function getStore(id){
      Base.get('/apiOrders/store_content/' + id + '.json').then(function(data){
        console.log(data);
      })
      return Base.get('/apiOrders/store_content/' + id + '.json');
    }
    function getStoreIntro(id){
      return Base.get('/apiOrders/store_story/' + id + '.json');
    }
  }

  /* @ngInject */
  function Tryings($log, Base){
    var self = this;

    return {
      list: list
    }

    function list(){
      return Base.get('/shichituan.json');
    }
  }
  function Offers($q,$log,Base,software,Users){
    var self = this;
    self.OFFER_STATUS = [
      {value: 'NEW', state:0, desc:'新的'},
      {value: 'GOING', state:3, desc:'可以使用'},
      {value: 'EXPIRED', state:1, desc:'已过期'},
      {value: 'INVALID', state:2, desc:'已失效'}
    ]
    return{
      list:list, 
      getOfferStatus: getOfferStatus, 
      isOfStates: isOfStates
    }
    function list(){
      var defer = $q.defer();
      Users.getToken().then(function(token){
        Base.get('/api_orders/my_offers.json?access_token='+token.access_token).then(function(item){
          defer.resolve(item);    
        }, function(e){defer.reject(e)})
      }, function(e){defer.reject(e)});
      return defer.promise;
    }
    function getOfferStatus(offer){
      offer = offer || {SharedOffer: {}};
      return _.find(self.OFFER_STATUS, function(offerStatus){return offerStatus.state == offer.SharedOffer.status}) || {};
    }
    function isOfStates(offer, states){
      var offerStatus = getOfferStatus(offer);
    }
  }

  function Addresses($log,$q,Base,software,Users){
    var self = this;
    return{
      list:list,
      getAddressById: getAddressById, 
      getAddress:getAddress,
      getDefaultAddress: getDefaultAddress, 
      deleteAddress: deleteAddress,
      editAddress: editAddress,
      addAddress: addAddress,
      def:def
    }
    function list(){
      var defer = $q.defer();
      Users.getToken().then(function(token){
        Base.get('/api_orders/order_consignees.json?access_token='+token.access_token).then(function(item){
          defer.resolve(item);
        }, function(e){defer.reject(e)});
      }, function(e){defer.reject(e)});
      return defer.promise;
    }
    function getDefaultAddress(){
      return list().then(function(addresses){
        var defaultAddress =  _.find(addresses, function(address){return address.OrderConsignees.status == 1});
        if(_.isEmpty(defaultAddress) && addresses.length > 0){
          defaultAddress = addresses[0];
        }
        return defaultAddress;
      });
    }
    function getAddressById(id){
      return list().then(function(addresses){
        return _.find(addresses, function(address){return address.OrderConsignees.id == id});
      });
    }
    function getAddress(provinceId,cityId,countyId){
      var defer = $q.defer();
      Users.getToken().then(function(token){
        Base.get('/Locations/get_address.json?province_id='+provinceId+'&city_id='+cityId+'&county_id='+countyId+'&access_token='+token.access_token).then(function(item){
          defer.resolve(item);
        }, function(e){defer.reject(e)})
      }, function(e){defer.reject(e)});
      return defer.promise;
    }
    function deleteAddress(id){
      var defer = $q.defer();
      Users.getToken().then(function(token){
        Base.get('/api_orders/delete_consignee/'+id+'.json?access_token='+token.access_token).then(function(result){
          defer.resolve(result);
        }, function(e){defer.reject(e)});
      }, function(e){defer.reject(e)});
      return defer.promise;
    }
    function editAddress(id,name,address,province_id,city_id,county_id,mobilephone){
      var defer = $q.defer();
      Users.getToken().then(function(token){
        Base.get('/api_orders/info_consignee.json?access_token='+token.access_token+'&type=edit&id='+id+'&name='+name+'&address='+address+'&province_id='+province_id+'&city_id='+city_id+'&county_id='+county_id+'&mobilephone='+mobilephone).then(function(result){
          defer.resolve(result);
        }, function(e){defer.reject(e)});
      }, function(e){defer.reject(e)});
      return defer.promise;
    }
    function addAddress(name,address,province_id,city_id,county_id,mobilephone){
      var defer = $q.defer();
      Users.getToken().then(function(token){
        Base.get('/api_orders/info_consignee.json?access_token='+token.access_token+'&type=create&name='+name+'&address='+address+'&province_id='+province_id+'&city_id='+city_id+'&county_id='+county_id+'&mobilephone='+mobilephone).then(function(result){
          $log.log("add address successfully:").log(result);
          defer.resolve(result);
        }, function(e){defer.reject(e)})
      }, function(e){defer.reject(e)});
      return defer.promise;
    }
    function def(id){
      var defer = $q.defer();
      Users.getToken().then(function(token){
        Base.get('/api_orders/info_consignee.json?access_token='+token.access_token+'&type=default&id='+id).then(function(result){         
          defer.resolve(result);
        }, function(e){defer.reject(e)});
      }, function(e){defer.reject(e)});
      return defer.promise;
    }
  }

  function Coupons($q,$log,Base,software,Users){
    var self = this;
    return{
      getCoupons: getCoupons
    }
    function getCoupons() {
      var defer = $q.defer();
      Users.getToken().then(function(token){
        Base.get('/api_orders/my_coupons.json?access_token='+token.access_token).then(function(item){
          defer.resolve(item);
        }, function(e){defer.reject(e)})
      }, function(e){defer.reject(e)});
      return defer.promise;
    }
  }

  function Carts($q,$log,Base,software,Users){
    var self = this;
    return{
      getCartItems:getCartItems,
      deleteCartItem: deleteCartItem,
      addCartItem: addCartItem,
      editNum:editNum, 
      getCartInfo: getCartInfo
    }
    function getCartInfo(pid_list,addressId,coupon_code){
      var json = {"pid_list":pid_list,"addressId":addressId,"coupon_code":coupon_code};
      var defer = $q.defer();
      Users.getToken().then(function(token){
        Base.post('/api_orders/cart_info.json?access_token='+token.access_token,json).then(function(result) {
          defer.resolve(result.data);
        }, function(e){defer.reject(e)});
      }, function(e){defer.reject(e)});
      return defer.promise;
    }
    function getCartItems(){
      var defer = $q.defer();
      Users.getToken().then(function(token){
      Base.get('/ApiOrders/list_cart.json?access_token='+token.access_token).then(function(list){
          defer.resolve(list);
        }, function(e){defer.reject(e)})
      }, function(e){defer.reject(e)})
      return defer.promise;
    }
    function deleteCartItem(id){
      var defer = $q.defer();
      Users.getToken().then(function(token){
        Base.get('/ApiOrders/cart_del/'+id+'.json?access_token='+token.access_token).then(function(result){
          $log.log("delete cart item successfully: ").log(result)
          defer.resolve(result);
        })
      })
      return defer.promise;
    }
    function addCartItem(id,num,spec,type,try_id){
      var defer = $q.defer();
      Users.getToken().then(function(token){
        var json = '{"product_id":'+id+',"num":'+num+',"spec":'+spec+',"type":'+type+',"try_id":'+try_id+'}';
        Base.post('/api_orders/cart_add.json?access_token='+token.access_token,json).then(function(result){
          if(result.data.success){
            defer.resolve(result.data);
          }
          else{
            defer.reject(result);
          }
        },function(e){defer.reject(e);})
      }, function(e){defer.reject(e)});
      return defer.promise;
    }
    function editNum(id,num){
      var defer = $q.defer();
      Users.getToken().then(function(token){
        Base.get('/api_orders/cart_edit_num/'+id+'/'+num+'.json?access_token='+token.access_token).then(function(result){
          if(result.success == true){
            defer.resolve(result);
          }
          else{
            defer.reject(result);
          }
        }, function(e){defer.reject(e)});
      }, function(e){defer.reject(e)});
      return defer.promise;
    }
  }
  function Profile($q,$log,Base,software,Users){
    var self = this;
    return {
      edit:edit
    }
    function edit(nickname,image,sex,bio,companies){
      var json = {};
      if(nickname != null){
        json['nickname'] = nickname; 
      }
      if(image != null){
        json['image'] = image;
      }
      if(sex != null){
        json['sex'] = sex;
      }
      if(bio != null){
        json['bio'] = bio;
      }
      if(companies != null){
        json['companies'] = companies;
      }
      for(var i=0;i<30;i++){
            $log.log('editProfile');
          }
      $log.log(json);
      Users.getToken().then(function(token){
        Base.post('/api_orders/edit_my_profile.json?access_token='+token.access_token,json).then(function(result){
          $log.log(result);
        })
      })
    }
  }
})(window, window.angular);