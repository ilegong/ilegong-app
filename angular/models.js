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
      return '网络不佳，请稍后再试';
    }
    return '加载失败，请稍后尝试';
  }
  this.getLoadingImage = function(){
    if(this.loading){
      return 'img/loading.gif';
    }
    return 'img/load-failed.png';
  }
};