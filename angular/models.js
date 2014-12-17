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

var AddressItem = function(id,name,area,address,mobilephone,telephone,email,postcode,province_id,city_id,county_id)

{
  this.OrderConsignees={
    'id':id,
    'name':name,
    'area':area,
    'address':address,
    'mobilephone':mobilephone,
    'telephone':telephone,
    'email':email,
    'postcode':postcode,
    'province_id':province_id,
    'city_id':city_id,
    'county_id':county_id
  }
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

var CouponState = function(pState,pString,pColor)
{
  this.state = pState;
  this.string = pString;
  this.color = pColor;
};

var Coupon = function(pTitle,pName,pState,pPrice,pDate_begin,pDate_end,pShopUrl)
{
  this.title = pTitle;
  this.name = pName;
  this.state = pState;
  this.price = pPrice;
  this.date_begin = pDate_begin;
  this.date_end = pDate_end;
  this.shopUrl = pShopUrl;
};

var OfferState = function(pState,pString)
{
  this.state = pState;
  this.string = pString;
};

var Offer = function(pName,pDate,pPrice,pState,pLinkUrl)
{
  this.name = pName;
  this.date = pDate;
  this.price = pPrice;
  this.state = pState;
  this.linkUrl = pLinkUrl;
  
};

var OrdersItem = function(pId,pState,pName,pNameUrl,pPrice,pProducts)
{
  this.id = pId;
  this.state = pState;
  this.name = pName;
  this.price = pPrice;
  this.products = pProducts;
};

var OrdersProductItem = function(pTitle,pImgUrl,pLinkUrl,pPrice,pCount)
{
  this.title = pTitle;
  this.imgUrl = pImgUrl;
  this.linkUrl = pLinkUrl;
  this.price = pPrice;
  this.count = pCount;
};

var OrderDetail = function(pId,pState,pDate_commit,pDate_paid,pName,pTelephone,pAddress,pPostCompany,pPostId,pContent,pProducts,pPostCost,pCouponCost)
{
  this.id = pId;
  this.state = pState;
  this.date_commit = pDate_commit;
  this.date_paid = pDate_paid;
  this.name = pName;
  this.telephone = pTelephone;
  this.address = pAddress;
  this.postCompany = pPostCompany;
  this.postId = pPostId;
  this.content = pContent;
  this.products = pProducts;
  this.postCost = pPostCost;
  this.couponCost = pCouponCost;
};
var OrderDetailProduct = function(pTitle,pImgUrl,pLinkUrl,pPrice,pCount)
{
  this.title = pTitle;
  this.imgUrl = pImgUrl;
  this.linkUrl = pLinkUrl;
  this.price =pPrice;
  this.count = pCount;
};
