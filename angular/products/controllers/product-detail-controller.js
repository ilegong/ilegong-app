(function (window, angular) {
  "use strict";

  angular.module('module.products')
  .controller('ProductDetailCtrl', ProductDetailCtrl)

  /* @ngInject */
  function ProductDetailCtrl($state, $ionicPopup, $q, $log, $rootScope, $scope, $stateParams,$http,$filter, $sce, Base, Products,Carts,Addresses,Orders){
    var vm = this;
    vm.loadData = loadData;
    vm.reduceCartItemNum = reduceCartItemNum;
    vm.addCartItemNum = addCartItemNum;
    vm.confirmComment = confirmComment;
    vm.isShowStar = function(comment,starIndex){return comment.Comment.rating > starIndex}  
    vm.commentT = {rating:5,text:'',images:[]};
    vm.isShowMakeCommentStar = function(index){return vm.commentT.rating > index}
    vm.formatSpecs = formatSpecs;
    vm.checkSpec = checkSpec;
    vm.checkDefaultSpecs = checkDefaultSpecs;
    vm.formatSpecsGroup = formatSpecsGroup;
    vm.getReputationComments = function(){return _.filter(vm.comments,function(comment){return comment.Comment.is_shichi_tuan_comment != '1'})}
    vm.getTryingComments = function(){return _.filter(vm.comments,function(comment){return comment.Comment.is_shichi_tuan_comment == '1'})}
    vm.toTryingCommentsPage = toTryingCommentsPage;
    vm.toReputationCommentsPage = toReputationCommentsPage;
    vm.addToCart = addToCart;
    vm.buyImmediately = buyImmediately;
    vm.onActionFailed = onActionFailed;
    vm.readyToBuy = readyToBuy;
    vm.toCartPage = function(){$state.go('app.cart');};
    vm.getCartTitle = getCartTitle;
    vm.getBuyTitle = getBuyTitle;
    vm.getShipFee = getShipFee;
    vm.trustAsHtml = trustAsHtml;
    vm.hasConsignDates = hasConsignDates;
    vm.checkConsignDate = checkConsignDate;
    vm.isConsignDateChecked = isConsignDateChecked;
    vm.checkShipSetting = checkShipSetting;
    vm.isShipSettingChecked = isShipSettingChecked;
    vm.getShipSettingName = getShipSettingName;
    vm.getSendDate = getSendDate;
    activate();
    
    function activate(){
      vm.count=1;
      vm.id = $stateParams.id;
      vm.type = $stateParams.type;
      vm.extraId = $stateParams.value;
      vm.rating = 5;
      vm.showProductIntro = false;
      vm.specs = [];
      vm.inprogress = false;

      vm.loadStatus = new LoadStatus();
      vm.loadData();
    }

    function loadData(){
      if(vm.loadStatus.isLoadFinished()){
        return;
      }
      vm.loadStatus.startLoading();
      return Products.getProduct(vm.id, vm.type, vm.extraId).then(function(data){
        vm.product = data.product;
        if(_.isEmpty(vm.product)){
          vm.loadStatus.failed(500);
          return;
        }
        vm.specs = vm.formatSpecs(vm.product.Product.specs);
        vm.specsGroup = vm.formatSpecsGroup(vm.product.Product.specs_group);
        vm.productPrice = vm.product.Product.price;
        vm.recommends = _.pairs(data.recommends);
        vm.brand = data.brand;
        vm.hasWeixinId = !_.isEmpty(vm.brand.Brand.weixin_id);
        vm.comments = [];
        vm.upload_files = data.upload_files;
        vm.ship_settings = data.ship_settings;

        vm.tuan = data.tuan;
        if(vm.type == 5 && !_.isEmpty(vm.tuan.tuan_buying.TuanBuying.consign_time)){
          vm.sendDate = vm.tuan.tuan_buying.TuanBuying.consign_time;
        }
        if(vm.type == 6){
          vm.productTry = data.product_try;
          vm.productTry.ProductTry.sold_num = Math.min(vm.productTry.ProductTry.sold_num, vm.productTry.ProductTry.limit_num);
          vm.productTry.ProductTry.sold_percent = Base.toPercent(vm.productTry.ProductTry.sold_num / vm.productTry.ProductTry.limit_num);
          $rootScope.$on("seckillStateChanged", function(event, productTry){
            if(vm.productTry.ProductTry.id == productTry.ProductTry.id){
              vm.productTry.ProductTry.status = productTry.ProductTry.status;
            }
          });
        }

        vm.checkDefaultSpecs();

        Products.getProductComment(vm.id).then(function(comments){
          vm.comments = comments;
        });

        vm.loadStatus.succeeded();
      }, function(e){
        vm.loadStatus.failed(e.status);
      });
    }
    function formatSpecs(specs){
      if(_.isEmpty(specs)){
        return [];
      }

      try{
        var specs = JSON.parse(specs); 
        var index = 0;
        return _.map(specs.choices, function(choices, type){
          var c = _.map(choices, function(choice){
            var id = _.findKey(specs.map, function(name, id){
              return name == choice;
            });
            return {id: id, name: choice, checked: false};
          });
          return {id: index++, type: type, choices: c};
        });
      }catch(e){
        $log.log('product ' + vm.id + ' specs is invalid: ' + specs, true).log(e, true);
        return [];
      }
    }
    function formatSpecsGroup(specsGroup){
      if(_.isEmpty(specsGroup)){
        return [];
      }
      return JSON.parse(specsGroup);
    }
    function checkSpec(typeId, choiceId){
      var type = _.find(vm.specs, function(spec){return spec.id == typeId});
      _.each(vm.specs, function(spec){
        if(spec.id != typeId){
          return;
        }
        _.each(spec.choices, function(choice){
          choice.checked = (choice.id == choiceId);
        });
      });

      var checkedSpecs = _.map(_.filter(vm.specs, function(spec){return _.any(spec.choices, function(c){return c.checked})}), function(spec){
        var choice = _.find(spec.choices, function(choice){
          return choice.checked;
        });
        if(_.isEmpty(choice)){
          return '';
        }
        return choice.id;
      }).join(',');
      
      vm.specGroup = _.find(vm.specsGroup, function(group, specs){
        return specs == checkedSpecs;
      });
      if(!_.isEmpty(vm.specGroup)){
        vm.productPrice = vm.specGroup.price;
      }
    }
    function checkDefaultSpecs(){
      _.each(vm.specs, function(spec){
        _.each(spec.choices, function(choice, index){
          if(index == 0){
            vm.checkSpec(spec.id, choice.id);
          }
        });
      });
      if(!_.isEmpty(vm.ship_settings)){
        vm.checkShipSetting(vm.ship_settings[0]);
      }
      if(!_.isEmpty(vm.product.Product.consign_dates)){
        vm.checkConsignDate(vm.product.Product.consign_dates[0]);
      }
    }
    function toTryingCommentsPage(){
      $state.go("product-detail-comments", {id: vm.id, type: 1});
    }
    function toReputationCommentsPage(){
      if(vm.getReputationComments().length == 0){
        return;
      }
      $state.go("product-detail-comments",{id: vm.id, type: 0});
    }

    function reduceCartItemNum(){
      vm.count= vm.type == 6 ? 1 : Math.max(vm.count - 1, 1);
    };
    function addCartItemNum() {
      vm.count= vm.type == 6 ? 1 : Math.min(vm.count + 1, 9999);
    };
    function confirmComment(){
      if(!$rootScope.user.loggedIn){
        return $state.go('account-login');
      }
      Products.makeComment(vm.product.Product.id,vm.commentT.rating,vm.commentT.text,null, $rootScope.user.token.access_token).then(function(data){
        activate();
      });
    }
    function hasConsignDates(){
      return !_.isEmpty(vm.product) && !_.isEmpty(vm.product.Product.consign_dates);
    }
    function checkConsignDate(consignDate){
      _.each(vm.product.Product.consign_dates, function(date){
        date.checked = (date.id == consignDate.id);
      });
    }
    function isConsignDateChecked(){
      return _.any(vm.product.Product.consign_dates, function(date){return date.checked});
    }
    function readyToBuy(){
      if(!Base.isNumber(vm.count)){
        return false;
      }
      var allSpecsChecked = _.all(vm.specs, function(spec){
        return _.any(spec.choices, function(choice){return choice.checked});
      })
      if(!allSpecsChecked){
        return false;
      }
      if(vm.hasConsignDates() && !vm.isConsignDateChecked()){
        return false;
      }
      if(vm.type == 5){
        if(_.isEmpty(vm.tuan)){
          return false;
        }
        if(vm.tuan.tuan_buying.TuanBuying.status == 'finished' || vm.tuan.tuan_buying.TuanBuying.status == 'canceled'){
          return false;
        }
        if(!vm.isShipSettingChecked()){
          return false;
        }
      }
      if(vm.type == 6){
        if(_.isEmpty(vm.productTry)){
          return false;
        }
        if(vm.productTry.ProductTry.status != 'sec_kill'){
          return false;
        }
      }
      if(vm.inprogress){
        return false;
      }
      return true;
    }
    function addToCart(){
      if(!$rootScope.user.loggedIn){
        return $state.go('account-login');
      }
      if(_.isEmpty(vm.specGroup)){
        return $rootScope.alertMessage('请选择规则');
      }

      vm.inprogress = true;
      var consignDate = _.find(vm.product.Product.consign_dates, function(date){return date.checked}) || {};
      Carts.addCartItem(vm.id, vm.count, vm.specGroup.id, 1, 0, consignDate.id, consignDate.send_date, $rootScope.user.token.access_token).then(function(result){
        vm.inprogress = false;
        $rootScope.reloadCart($rootScope.user.token.access_token);
        $rootScope.alertMessage('商品添加成功');
      }, function(e){
        vm.onActionFailed('添加到购物车失败，请重试', e);
      });
    }
    function buyImmediately(){
      if(!$rootScope.user.loggedIn){
        return $state.go('account-login');
      }
      if(vm.specsGroup.length > 0 && _.isEmpty(vm.specGroup)){
        return $rootScope.alertMessage('请选择规则');
      }
      vm.inprogress = true;
      var couponCode = '';
      var consignmentDateId = null;
      var sendDate = vm.sendDate;
      if(vm.hasConsignDates()){
        var consignmentDate = _.find(vm.product.Product.consign_dates, function(date){return date.checked}) || {};
        consignmentDateId = consignmentDate.id;
        sendDate = consignmentDate.send_date;
      }

      var json = {"product_id":vm.product.Product.id, "num":vm.count, "spec_id":_.isEmpty(vm.specGroup) ? '' : vm.specGroup.id, "consignment_date_id": consignmentDateId, "send_date": sendDate};
      if(vm.type == 5){
        json = _.extend(json, {"tuan_buying_id": vm.tuan.tuan_buying.TuanBuying.id});
      }
      else if(vm.type == 6){
        json = _.extend(json, {"product_try_id": vm.product_try.ProductTry.id});
      }
      var shipSetting = _.find(vm.ship_settings, function(setting){ return setting.checked});
      
      Carts.addCartItem(vm.type, json, $rootScope.user.token.access_token).then(function(result){
        var cartId = result.data.cart_id;
        $rootScope.reloadCart($rootScope.user.token.access_token).then(function(){
          $rootScope.confirmCart([cartId], couponCode, $rootScope.user.token.access_token).then(function(){
            vm.inprogress = false;
            $state.go('cart-confirmation', {'type': vm.type, 'shipSettingId': shipSetting.ProductShipSetting.id});
          }, function(e){
            vm.onActionFailed('购买失败，请重试', e);
          });
        }, function(e){
          vm.onActionFailed('购买失败，请重试', e);
        });
      }, function(e){
        vm.onActionFailed('购买失败，请重试', e);
      });
    }
    function onActionFailed(message, e){
      vm.inprogress = false;
      $log.log('buy failed: ').log(e);
      $rootScope.alertMessage(message);
    }
    function getBuyTitle(product){
      if(vm.type == 5){
        if(_.isEmpty(vm.tuan)){
          return '立即购买';
        }
        if(vm.tuan.tuan_buying.TuanBuying.status == 'finished' || vm.tuan.tuan_buying.TuanBuying.status == 'canceled'){
          return '团购已结束';
        }
        return '立即购买';
      }
      if(vm.type == 6){
        if(_.isEmpty(vm.productTry)){
          return '立即秒杀';
        }
        if(vm.productTry.ProductTry.status == 'sec_end'){
          return '秒杀已结束';
        }
        else if(vm.productTry.ProductTry.status == 'sec_unstarted'){
          return '秒杀未开始';
        }
        return '立即秒杀';
      }

      return '立即购买';
    }
    function getCartTitle(){
      if(_.isEmpty(vm.product) || _.isEmpty(vm.product.Product)){
        return '加入购物车';
      }
      if(!vm.product.Product.published){
        return '该商品已下架';
      }
      if(vm.product.Product.limit_ship){
        return '不支持购物车';
      }
      return '加入购物车';
    }
    function getShipFee(){
      if(_.isEmpty(vm.product)){
        return '';
      }
      if(vm.type == 1){
        if(vm.product.Product.ship_fee == -1){
          return '货到付款';
        }
        else if(vm.product.Product.ship_fee == -2 || vm.product.Product.limit_ship){
          return '自提';
        }
        else if(vm.product.Product.ship_fee == 0){
          return '包邮';
        }
        return $filter('currency')(vm.product.Product.ship_fee, '￥');
      }
      else{
        var shipSetting = _.find(vm.ship_settings, function(setting){ return setting.checked});
        if(_.isEmpty(shipSetting)){
          return '请选择物流方式';
        }
        if(shipSetting.ProductShipSetting.code == 'kuaidi'){
          return '快递(' + (shipSetting.ProductShipSetting.ship_val / 100) + ')';
        }
        return shipSetting.ProductShipSetting.name;
      }
    }
    function trustAsHtml(string){
      return $sce.trustAsHtml(string);
    }
    function getShipSettingName(shipSetting){
      if(shipSetting.ProductShipSetting.ship_type != 6){
        return shipSetting.ProductShipSetting.name;
      }
      return shipSetting.ProductShipSetting.name + '(' + shipSetting.ProductShipSetting.ship_fee + '元邮费)';
    }
    function checkShipSetting(shipSetting){
      _.each(vm.ship_settings, function(setting){
        setting.checked = (setting.ProductShipSetting.id == shipSetting.ProductShipSetting.id);
      });
    }
    function isShipSettingChecked(){
      return _.isEmpty(vm.ship_settings) || _.any(vm.ship_settings, function(shipSetting){return shipSetting.checked});
    }
    function getSendDate(date){
      var date = new Date(date)
      return (date.getMonth() + 1) + '月' + date.getDate() + '日';
    }
  }
})(window, window.angular);