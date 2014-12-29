(function (window, angular) {
  "use strict";

  angular
  .module('app.services', ['LocalForageModule'])
  .value('software', {fakeData: false, app: {client_id: 'NTQ5NTE5MGViMTgzMDUw', name: 'ailegong', version: ''}, server: {address: 'http://www.tongshijia.com'}})
  .service('Base', Base)
  .service('Users', Users)
  .service('Products', Products)
  .service('Orders',Orders)
  .service('Categories', Categories)
  .service('OrderDetail',OrderDetail)
  .service("Stores", Stores)
  .service("Tryings", Tryings)
  .service("Offers",Offers)
  .service("Coupons",Coupons)
  .service('Addresses',Addresses)
  .service('Carts',Carts)

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
      logout: logout
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
  }

  /* @ngInject */
  function Products($q,$log, Base,software,Users){
    var self = this;
    return {
      list: list,
      getProduct:getProduct,
      getProductContent:getProductContent,
      getProductComment:getProductComment
    }

    function list(){
      return Base.get('/categories/mobileHome.json');
    }
    function getProduct(id){
      var defer = $q.defer();
      Users.getToken().then(function(token){
        Base.get('/api_orders/product_detail/'+id+'.json?access_token='+token.access_token).then(function(product){
          defer.resolve(product);

        })

      })
        return defer.promise;
    }
    function getProductContent(id){
      return Base.get('/apiOrders/product_content/'+id+'.json')
    }
    function getProductComment(id){
      return Base.get('/comments/getlist/Product/'+id+'.json')
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

    return {
      list: list,
      allProvince: allProvince,
      getCities:getCities,
      getCounties:getCounties,
      cartInfo:cartInfo,
      balance:balance
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
    function allProvince(){
      return Base.get('/Locations/get_province.json');
    }
    function getCities(id){
      return Base.get('/Locations/get_city.json?provinceId='+id);
    }
    function getCounties(id){
      return Base.get('/Locations/get_county.json?cityId='+id);
    }
    function cartInfo(pid_list,addressId,coupon_code){

      var json = {"pid_list":pid_list,"addressId":addressId,"coupon_code":coupon_code};

     
      var defer = $q.defer();

      Users.getToken().then(function(token){
      Base.post('/api_orders/cart_info.json?access_token='+token.access_token,json).then(function(data) {

         
    
            defer.resolve(data);
          
        })
      })
      return defer.promise;
    }
    function balance(pid_list,addressId,coupon_code,remarks){
      var json = {"pid_list":pid_list,"addressId":addressId,"coupon_code":coupon_code,"remarks":remarks};
      var defer =  $q.defer();
      for(var i=0;i<50;i++)
        $log.log('asd');
      $log.log(json);
      Users.getToken().then(function(token){
        Base.post('/api_orders/balance.json?access_token='+token.access_token,json).then(function(result){
          $log.log(result);
        })
      })
    }
  }

  function OrderDetail($q,Base,Users){
    var self = this;
    return {
      list: list
    }
    function list(id){
      var defer = $q.defer();
      Users.getToken().then(function(token){
        Base.get('/apiOrders/order_detail/'+id+'.json?access_token='+token.access_token).then(function(item){
          defer.resolve(item);
        })
      })

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
    return{
      list:list
    }
    function list(token){
      var defer = $q.defer();
      Users.getToken().then(function(token){
        Base.get('/api_orders/my_offers.json?access_token='+token.access_token).then(function(item){
          defer.resolve(item);    
        })
      })
      return defer.promise;
    }
  }

  function Addresses($log,$q,Base,software,Users){
    var self = this;
    return{
      list:list,
      getAddress:getAddress,
      del:del,
      edit:edit,
      add:add
    }
    function list(){
      var defer = $q.defer();
      Users.getToken().then(function(token){
        Base.get('/api_orders/order_consignees.json?access_token='+token.access_token).then(function(item){
          defer.resolve(item);
        })
      })
      return defer.promise;
    }
    function getAddress(provinceId,cityId,countyId){
      var defer = $q.defer();
      Users.getToken().then(function(token){
        Base.get('/Locations/get_address.json?province_id='+provinceId+'&city_id='+cityId+'&county_id='+countyId+'&access_token='+token.access_token).then(function(item){
          defer.resolve(item);
        })
      })
      return defer.promise;
    }
    function del(id){
      Users.getToken().then(function(token){
        Base.get('/api_orders/delete_consignee/'+id+'.json?access_token='+token.access_token).then(function(result){
          for(var i = 0;i<50;i++)
            $log.log('del');
          $log.log(result);
        })
      })
    }
    function edit(id,name,address,province_id,city_id,county_id,mobilephone){
      Users.getToken().then(function(token){
        Base.get('/api_orders/info_consignee.json?access_token='+token.access_token+'&type=edit&id='+id+'&name='+name+'&address='+address+'&province_id='+province_id+'&city_id='+city_id+'&county_id='+county_id+'&mobilephone='+mobilephone).then(function(result){
          for(var i = 0;i<50;i++)
            $log.log('edit');
          $log.log('/api_orders/info_consignee.json?access_token='+token.access_token+'&type=edit&id='+id+'&name='+name+'&address='+address+'&province_id='+province_id+'&city_id='+city_id+'&county_id='+county_id+'&mobilephone='+mobilephone);
          $log.log(result);
        })
      })
    }
    function add(name,address,province_id,city_id,county_id,mobilephone){
      Users.getToken().then(function(token){
        Base.get('/api_orders/info_consignee.json?access_token='+token.access_token+'&type=create&name='+name+'&address='+address+'&province_id='+province_id+'&city_id='+city_id+'&county_id='+county_id+'&mobilephone='+mobilephone).then(function(result){
          for(var i =0;i<50;i++)
            $log.log('add');
          $log.log('/api_orders/info_consignee.json?access_token='+token.access_token+'&type=create&name='+name+'&address='+address+'&province_id='+province_id+'&city_id='+city_id+'&county_id='+county_id+'&mobilephone='+mobilephone);
          $log.log(result);
        })
      })
    }
  }
  function Coupons($q,$log,Base,software,Users){
    var self = this;
    return{
      list:list
    }
    function list() {
      var defer = $q.defer();
      Users.getToken().then(function(token){
        Base.get('/api_orders/my_coupons.json?access_token='+token.access_token).then(function(item){
          defer.resolve(item);
        })
      })
      return defer.promise;
    }
  }
  function Carts($q,$log,Base,software,Users){
    var self = this;
    return{
      list:list,
      del:del,
      add:add,
      editNum:editNum
    }
    function list(){
      var defer = $q.defer();
      Users.getToken().then(function(token){
        
        Base.get('/ApiOrders/list_cart.json?access_token='+token.access_token).then(function(list){
          defer.resolve(list);
        }, function(e){defer.reject(e)})
      })
      return defer.promise;
    }
    function del(id){
      var defer = $q.defer();
      Users.getToken().then(function(token){
        Base.get('/ApiOrders/cart_del/'+id+'.json?access_token='+token.access_token).then(function(item){
          defer.resolve(item);
        })
      })
      return defer.promise;
    }
    function add(id,num,spec,type,try_id){
      var defer = $q.defer();
      Users.getToken().then(function(token){
        var json = '{"product_id":'+id+',"num":'+num+',"spec":'+spec+',"type":'+type+',"try_id":'+try_id+'}';
        Base.post('/api_orders/cart_add.json?access_token='+token.access_token,json).then(function(result){
    
       
        },function(e){
          
       
        })
      })
    }
    function editNum(id,num){
      var defer = $q.defer();
      Users.getToken().then(function(token){
        Base.get('/api_orders/cart_edit_num/'+id+'/'+num+'.json?access_token='+token.access_token).then(function(result){
          defer.resolve(result);
        })
      })
      return defer.promise;
    }
  }
})(window, window.angular);