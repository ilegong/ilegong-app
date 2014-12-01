var Sharing = function(id, product, name, link, imgSrc){
  this.id = id;
  this.product = product;
  this.name = name;
  this.link = link;
  this.imgSrc = imgSrc;
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
var ProductItem = function(pCat,pSubItems)
{
  this.cat = pCat;
  this.subItems = pSubItems;
};
var ProductCat = function(pTitle,pStyle,pImgUrl,pLinkUrl)
{
  this.title = pTitle;
  this.style = pStyle;
  this.imgUrl = pImgUrl;
  this.linkUrl = pLinkUrl;
};
var ProductSubItem = function(pTitle,pTitleStyle,pName,pNameStyle,pImgUrl,pLinkUrl)
{
  this.title = pTitle;
  this.titleStyle = pTitleStyle;
  this.name = pName;
  this.nameStyle = pNameStyle;
  this.imgUrl = pImgUrl;
  this.linkUrl = pLinkUrl;
};
var ProductDetail = function(pId,pTitle,pImgUrl,pHasRedPacket,pPostDetail,pPrice,pOldPrice,pPostStyle,pCount,pDetail,pEvaluate)
{
  this.id = pId;  
  this.title = pTitle;
  this.imgUrl = pImgUrl;
  this.hasRedPacket = pHasRedPacket;
  this.postDetail = pPostDetail;
  this.price = pPrice;
  this.oldPrice = pOldPrice;
  this.postStyle = pPostStyle;
  this.count = pCount;
  this.detail = pDetail;
  this.evaluate = pEvaluate;
};

var UserInfo = function(pUserId,pUserName,pNickName,pImgUrl,pSex,pCompany,pContent,pTelephone,pMail,pPassword)
{
  this.userId = pUserId;
  this.userName = pUserName;
  this.nickName = pNickName;
  this.imgUrl = pImgUrl;
  this.sex = pSex;
  this.company = pCompany;
  this.content = pContent;
  this.telephone = pTelephone;
  this.mail = pMail;
  this.password = pPassword;


};

var CartItem = function(pTitle,pImgUrl,pPrice,pCount,pLinkUrl)
{
  this.title = pTitle;
  this.imgUrl = pImgUrl;
  this.price = pPrice;
  this.count = pCount;
  this.linkUrl = pLinkUrl;
};
var RegionSelectItem = function(pTitle,pId,pContent)
{
  this.title = pTitle;
  this.id = pId;
  this.content = pContent;
};

var UserInfoWithAddresses= function(pUserId,pUserName,pNickName,pImgUrl,pSex,pCompany,pContent,pTelephone,pMail,pPassword,pAddresses)
{
  this.userId = pUserId;
  this.userName = pUserName;
  this.nickName = pNickName;
  this.imgUrl = pImgUrl;
  this.sex = pSex;
  this.company = pCompany;
  this.content = pContent;
  this.telephone = pTelephone;
  this.mail = pMail;
  this.password = pPassword;
  this.addresses = pAddresses;

};

var AddressItem = function(pDef,pName,pRegion_1,pRegion_2,pRegion_3,pAddress,pTelephone)
{
  this.def = pDef;
  this.name = pName;
  this.region_1 = pRegion_1;
  this.region_2 = pRegion_2;
  this.region_3 = pRegion_3;
  this.address = pAddress;
  this.telephone = pTelephone;
};

var OrderProductItem = function(pUserName,pTitle,pPrice,pCount,pMessage)
{
  this.userName = pUserName;
  this.title = pTitle;
  this.price = pPrice;
  this.count = pCount;
  this.message = pMessage;
};

var Order = function(pUserInfo,pProducts,pPromotionCode,pPrivilege,pFreight)
{
  this.userInfo = pUserInfo;
  this.products = pProducts;
  this.promotionCode = pPromotionCode;
  this.privilege = pPrivilege;
  this.freight = pFreight;
};
