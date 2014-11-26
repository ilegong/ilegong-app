(function (window, angular) {
  "use strict";

  angular.module('ilegong.home', [])
  .controller('HomeCtrl', HomeCtrl)

  /* @ngInject */
  function HomeCtrl($scope){
    active();

    
    $scope.SlideBoxItems = [
                            {imgUrl:'http://51daifan.sinaapp.com/img/banner/pyshuo_banner_fengli.jpg',linkUrl:'http://www.tongshijia.com/products/20140809/tai_wan_tu_feng_li_su.html'},
                            {imgUrl:'http://51daifan.sinaapp.com/img/banner/pyshuo_banner_follower.jpg',linkUrl:'http://www.tongshijia.com/products/20140903/qing_hai_hu_hua_fen.html'},
                            {imgUrl:'http://51daifan.sinaapp.com/img/banner/pyshuo_banner_yanyan.jpg',linkUrl:'http://www.tongshijia.com/products/20140901/yan_yan_jia_de_mi.html'}
                            ];


    $scope.ProductL1 = [
    	new Product(1,'搜狐潘婷家的喀什灰枣君',40.00,0,'搜狐-潘婷','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_m/4114dd5ab71_1119.jpg','http://51daifan-images.stor.sinaapp.com/files/201410/thumb_m/0e712bebad0_1004.jpg','http://www.tongshijia.com/products/20141117/xin_jiang_hui_zao.html',false,'http://www.tongshijia.com/brands/20141117/qu_na_er_li_rui.html'),
    	new Product(2,'西域美农椒盐碧根果250g',25.99,64.50,'西域美侬-李春望','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_m/873270830e5_1119.jpg','http://51daifan-images.stor.sinaapp.com/files/201409/thumb_m/56653661417_0908.jpg','http://www.tongshijia.com/products/20141118/xi_yu_mei_nong_jiao_yan_bi_gen_guo_250g.html',true,'http://www.tongshijia.com/brands/20140908/xi_yu_mei_nong_li_chun_wang.html')
    ]
    $scope.TypeAndProducts = [
	    new TypeAndProducts(
	    	new Type('枣、干果','http://www.tongshijia.com/categories/tag/xiaochilingshi.html'),
	    	[
	    		new Product(1,'枣、干果1',13,0,'商家1','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_m/9cd2a96c9c7_1118.jpg','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/9aa6c4bcce1_1110.jpg','http://www.baidu.com',true,'http://www.tongshijia.com/brands/20141117/qu_na_er_li_rui.html'),
				new Product(2,'枣、干果2',24,30,'商家2','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_m/4114dd5ab71_1119.jpg','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_m/06c7c8c5851_1119.jpg','http://www.baidu.com',false,'http://www.tongshijia.com/brands/20141117/qu_na_er_li_rui.html')
			]),
		new TypeAndProducts(
			new Type('新鲜水果','http://www.tongshijia.com/categories/tag/shuiguoganguo.html'),
			[
				new Product(1,'新鲜水果1',13,0,'商家1','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_m/9cd2a96c9c7_1118.jpg','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/9aa6c4bcce1_1110.jpg','http://www.baidu.com',true,'http://www.tongshijia.com/brands/20141117/qu_na_er_li_rui.html'),
				new Product(2,'新鲜水果2',24,30,'商家2','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_m/4114dd5ab71_1119.jpg','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_m/06c7c8c5851_1119.jpg','http://www.baidu.com',false,'http://www.tongshijia.com/brands/20141117/qu_na_er_li_rui.html'),
				new Product(3,'枣、干果2',24,30,'商家2','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_m/4114dd5ab71_1119.jpg','http://51daifan-images.stor.sinaapp.com/files/201411/thumb_m/06c7c8c5851_1119.jpg','http://www.baidu.com',false,'http://www.tongshijia.com/brands/20141117/qu_na_er_li_rui.html')
			])
	]

  $scope.items = [{cat:{title:'枣、干果',style:'',imgUrl:'http://www.tongshijia.com/img/class/classn5.png',linkUrl:"http://baidu.com"},
                    subItems:[
                      {title:'椒盐碧根果250g',titleStyle:'color:#9ab300;',name:'西域美农-李春望',nameStyle:'',imgUrl:'http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/b7fdeee1f2f_1118.jpg',linkUrl:"http://baidu.com"},
                      {title:'沧州新产金丝小枣',titleStyle:'color:#a00f12;',name:'检验员-宋德香',nameStyle:'',imgUrl:'http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/d821d549dae_1123.jpg',linkUrl:"http://baidu.com"}]},
                  {cat:{title:'新鲜水果',style:'',imgUrl:'http://www.tongshijia.com/img/class/classn3.png',linkUrl:"http://baidu.com"},
                    subItems:[
                      {title:'河南河阴软籽石榴',titleStyle:'color:#b07406;',name:'郑州民政局-段赵明',nameStyle:'',imgUrl:'http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/03ca7900316_1104.jpg',linkUrl:"http://baidu.com"},
                      {title:'山东精品红富士',titleStyle:'color:#772617;',name:'材料学博士-刘丙学',nameStyle:'',imgUrl:'http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/9036455c197_1125.jpg',linkUrl:"http://baidu.com"}]},
                  {cat:{title:'蛋糕甜点',style:'',imgUrl:'http://www.tongshijia.com/img/class/classn8.png',linkUrl:"http://baidu.com"},
                    subItems:[
                      {title:'开心果牛轧糖',titleStyle:'color:#ae950e;',name:'营养师-王扬',nameStyle:'',imgUrl:'http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/0684c2cc96b_1107.jpg',linkUrl:"http://baidu.com"},
                      {title:'印尼古法千层蛋糕',titleStyle:'color:#e74e01;',name:'材料学博士-刘丙学',nameStyle:'',imgUrl:'http://51daifan-images.stor.sinaapp.com/files/201411/thumb_s/371c77a62be_1120.jpg',linkUrl:"http://baidu.com"}]}]
    function active(){
    }
  }


})(window, window.angular);