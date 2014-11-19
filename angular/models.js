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

var Category = function(id, title, explain, link, imgSrc){
  this.id = id;
  this.title = title;
  this.explain = explain;
  this.link = link;
  this.imgSrc = imgSrc;
};