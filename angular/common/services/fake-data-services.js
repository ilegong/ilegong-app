(function (window, angular) {
  "use strict";

  angular.module('module.services')
  .service("FakeData", FakeData)

  function FakeData(){
    var getData = {
      '/api_orders/home.json': homeJson,
      '/categories/tag/': categoriesJson,
      '/api_orders/mine.json' : ordersJson,
      '/apiOrders/order_detail/\\d+.json': orderDetail,
      '/myDetail': myDetail,
      '/api_orders/store_list.json': storeListJson,
      '/shichituan.json': tryingsJson,
      '/api_orders/articles/': articleJson, 
      '/Locations/get_province.json':allProvince,
      "/api_orders/product_detail/\\d+.json": productDetail,
      "/apiOrders/store_content/\\d+.json": brandJson,
      "/apiOrders/store_story/\\d+.json": brandIntroJson,
      "/apiOrders/product_content/\\d+.json": productContent,
      "/comments/getlist/Product/\\d+.json": productComment,
      "/Locations/get_city.json": cities,
      "/Locations/get_county.json": counties,
      "/Locations/get_address.json": Address,
      "/api_orders/order_consignees.json": Addresses,
      "/ApiOrders/list_cart.json":Carts,
      "/api_orders/cart_edit_num/\\d+/\\d+.json":CartsEditNumResult,
      "/check/verify": {success: true},
      "/check/message_code": {success: true},
      "/api_orders/my_offers.json": Offers,
      "/api_orders/my_coupons.json": Coupons,
      "/api_orders/my_profile.json": myProfileJson,
      "/api_orders/confirm_undo/\\d+.json": OrderUndo,
      "/api_orders/confirm_remove/\\d+.json": OrderRemove,
      "/api_orders/confirm_receive/\\d+.json": OrderReceive,
      "/ali_pay/wap_to_alipay/\\d+": aliPay,
      "/oauth/register": tokenJson,
      "grant_type=password":tokenJson,
      "grant_type=refresh_token":tokenJson
    };

    var postData = {
      "/api_orders/cart_info.json": CartInfo,
      "/api_orders/balance.json": Balance,
      "/api_orders/edit_my_profile.json":ProfileEdit,
      "/api_orders/cart_add.json": addCartJson,
      "/api_orders/comment_add.json":commentAddJson
    };
    var getLocalData = {
       'token': {},
       "user": myProfileJson
    }
    return {
      get: function(url){return getFrom(getData, url)},
      post: function(url){return getFrom(postData, url)},
      getLocal: function(key){return getFrom(getLocalData, key)}
    }

    function getFrom(data, key){
      return _.find(data, function(v, k){return new RegExp(k).test(key)});
    }
  }
})(window, window.angular);

