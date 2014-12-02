(function (window, angular) {
  "use strict";

  angular
  .module('app.services', [])
  .value('software', {app: {id: '201411290001', name: 'ailegong', version: ''}, server: {address: 'http://www.tongshijia.com', port: 80}})
  .service('Base', Base)
  .service('Products', Products)

  /* @ngInject */
  function Base($http, $q, software){
    var self = this;
    return {
      get: get, 
      deferred: deferred
    }

    function get(url){
      return $http.get(software.server.address + url);
    }

    function deferred(data){
      var defer = $q.defer();
      defer.resolve(data);
      return defer.promise;
    }
  }

  /* @ngInject */
  function Products(Base){
    var self = this;

    return {
      list: list
    }

    function list(){
      // return Base.get('/categories/mobileHome.json');
      var sample = {  
        "brands":{  
          "8":{  
             "Brand":{  
                "id":"8",
                "name":"\u6700\u65b0\u63a8\u8350",
                "created":"2014-01-27 09:52:28",
                "slug":"",
                "coverimg":"http:\/\/51daifan-images.stor.sinaapp.com\/files\/201401\/thumb_m\/2eb8846d77e_0127.jpg"
             }
          }
        },
        "tagsWithProducts":[  
          {  
             "ProductTag":{  
                "id":"1",
                "name":"\u6700\u65b0\u63a8\u8350",
                "slug":"hottest",
                "priority":"1000",
                "show_in_home":"1",
                "published":true,
                "created":null,
                "size_in_home":"8", 
                "coverimg":"\/img\/class\/classn1.png"
             },
             "Products":[  
                {  
                   "id":"202",
                   "name":"\u6cb3\u5357\u6cb3\u9634\u8f6f\u7c7d\u77f3\u69b410\u65a4\u88c5",
                   "created":"2014-10-13 19:32:00",
                   "brand_id":"57",
                   "coverimg":"http:\/\/51daifan-images.stor.sinaapp.com\/files\/201411\/thumb_m\/152d619104b_1123.jpg",
                   "promote_name":"",
                   "comment_nums":"6",
                   "price":"129",
                   "original_price":"158",
                   "slug":"he_nan_xing_yang_he_yin_ruan_zi_shi_liu_8liang"
                }
             ]
          }
        ],
        "sub_title":null
      };
      return Base.deferred(sample);
    }
  }

})(window, window.angular);