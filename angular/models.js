var Sharing = function(id, product, name, link, img){
  this.id = id;
  this.product = product;
  this.name = name;
  this.link = link;
  this.img = img;
};

var Trying = function(id, title, summary, link, imgSrc){
  this.id = id;
  this.title = title;
  this.summary = summary;
  this.link = link;
  this.imgSrc = imgSrc;
};

var Category = function(id, title, explain, imgSrc, userSrc){
  this.id = id;
  this.title = title;
  this.explain = explain;
  this.imgSrc = imgSrc;
  this.userSrc = userSrc;
};

var Product = function(id,title,price,price_old,owner,imgSrc,owner_imgSrc,linkUrl,hasRedPacket,ownerUrl){
  this.id = id;
  this.title = title;
  this.price = price;
  this.price_old = price_old;
  this.owner = owner;
  this.imgSrc = imgSrc;
  this.owner_imgSrc = owner_imgSrc;
  this.linkUrl = linkUrl;
  this.hasRedPacket = hasRedPacket;
  this.ownerUrl = ownerUrl;
};

var Type = function(typeName,typeUrl)
{
  this.name = typeName;
  this.url = typeUrl;
};

var TypeAndProducts = function(type,products)
{
  this.type = type;
  this.products = products; 
};

var SlideBoxItem = function(imgUrl,linkUrl)
{
  this.imgUrl = imgUrl;
  this.linkUrl = linkUrl;
};

var ProductDetail = function(id,imgUrl,title,hasRedPacket,postDetail,price,postStyle,count,size,infomation)
{


};

var UserInfo = function(userName)
{
  this.userName = userName;

};


