var LoadStatus = function(){
  this.loading = true;
  this.loaded = false;
  this.loadFailed = false;
  this.status = null;
  
  this.failed = function(status){
    this.loading = false;
    this.loaded = false;
    this.loadFailed = true;
    this.status = status;
  }
  this.succeeded = function(){
    this.loading = false;
    this.loaded = true;
    this.loadFailed = false;
  }
  this.startLoading = function(){
    this.loading = true;
  }
  this.isLoadFinished = function(){
    return this.loaded;
  }
  this.getMessage = function(){
    if(this.loaded){
      return '';
    }
    if(this.loading){
      return '正在加载，请稍候...';
    }
    if(this.status == 0){
      return '网络链接不可用，请稍后重试';
    }
    return '加载失败，请稍后重试';
  }
  this.getLoadingImage = function(){
    if(this.loading){
      return 'img/loading.gif';
    }
    return 'img/load-failed.png';
  }
};

var Shippment = function(limitShip, pickups, ship_val){
  this.limitShip = limitShip;
  this.pickups = _.map(pickups, function(p){
    p.checked = false;
    return p;
  });
  this.pickup = {};
  this.username = '';
  this.mobile = '';
  this.detailedAddress = '';

  this.checkPickup = function(pickup){
    _.each(this.pickups, function(p){
      p.checked = (p.id == pickup.id);
    });
    this.pickup = pickup;
  }
  this.anyPickupChecked = function(){
    return _.any(this.pickups, function(p){return p.checked}); 
  }
  this.needAddressRemark = function(){
    if(_.isEmpty(this.pickup)){
      return false;
    }
    return this.pickup.can_remark_address == 1;
  }
};