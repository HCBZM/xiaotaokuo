// pages/cart/cart.js
let util = require('../../utils/util.js');
let myCartProductsRecall = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAllChoice: true,
    totalMoney: 0,
    totalCount: 0,
    isEdit: false,
    myCartProducts: [
      {
        shopId: 1,
        log: '',
        title: '当当网',
        isChoice: true,
        totalMoney: 0,
        products: [
          {title: '盗墓笔记（套装全9册）', pid: '1', imgSrc: '/images/product/3.jpg', keyword: '限时抢', prevPrice: '343.00', curPrice: ['216', '00'], price: '216.00', number: 1, inventory: 230, isChoice: true},
          {title: '小王子（名家全译本，原版插图精美再现，版语文教材阅读，傅雷翻译出版奖得主郑克鲁法语原文直译）', pid: '2', imgSrc: '/images/product/1.jpg', keyword: '限时抢', prevPrice: '22.50', curPrice: ['9', '90'], price: '9.90', number: 2, inventory: 1000, isChoice: true}
        ]
      },
      {
        shopId: 2,
        log: '',
        title: '我的店铺',
        isChoice: true,
        totalMoney: 0,
        products: [
          {title: '盗墓笔记（套装全9册）', pid: '21', imgSrc: '/images/product/3.jpg', keyword: '限时抢', prevPrice: '343.00', curPrice: ['216', '00'], price: '216.00', number: 1, inventory: 230, isChoice: true},
          {title: '小王子（名家全译本，原版插图精美再现，版语文教材阅读，傅雷翻译出版奖得主郑克鲁法语原文直译）', pid: '22', imgSrc: '/images/product/1.jpg', keyword: '限时抢', prevPrice: '22.50', curPrice: ['9', '90'], price: '9.90', number: 2, inventory: 1000, isChoice: true}
        ]
      }
    ],
    products: [
      {title: '盗墓笔记（套装全9册）', pid: '1', imgSrc: '/images/product/3.jpg', keywords: [{id: 1, keyword: '当当自营'}, {id: 1, keyword: '券'}, {id: 1, keyword: '满减', importance: true}], prevPrice: '343.00', curPrice: '216.00'},
      {title: '小王子（名家全译本，原版插图精美再现，版语文教材阅读，傅雷翻译出版奖得主郑克鲁法语原文直译）', pid: '2', imgSrc: '/images/product/1.jpg', keywords: [{id: 1, keyword: '当当自营'}, {id: 1, keyword: '券'}, {id: 1, keyword: '满减', importance: true}], prevPrice: '22.50', curPrice: '9.90'},
    ]
  },

  /* 事件方法 */
  choiceChange (event) {
    let shopIndex = event.currentTarget.dataset.shopindex;
    let productIndex = event.currentTarget.dataset.productindex;
    let product = this.data.myCartProducts[shopIndex].products[productIndex];
    let isChoice = !product.isChoice;
    let allChoiceFlag = isChoice ? this.checkIsShopChoice(shopIndex, productIndex) : false;
    let data = Object.create(null);
    if (allChoiceFlag) {
      data[`myCartProducts[${shopIndex}].isChoice`] = isChoice;
      if (this.checkIsAllChoice(shopIndex))
        data.isAllChoice = true;
    } else {
      if (this.data.myCartProducts[shopIndex].isChoice)
        data[`myCartProducts[${shopIndex}].isChoice`] = false;
      if (this.data.isAllChoice)
        data.isAllChoice = false;
    }
    data[`myCartProducts[${shopIndex}].products[${productIndex}].isChoice`] = isChoice;
    this.totalMoneyChange(data, 'choice', {
      shopIndex,
      number: product.number,
      price: product.price,
      isChoice
    })
  },
  numberChange (event) {
    let shopIndex = event.currentTarget.dataset.shopindex;
    let productIndex = event.currentTarget.dataset.productindex;
    let number = event.detail.number;
    let product = this.data.myCartProducts[shopIndex].products[productIndex];
    this.totalMoneyChange({
      [`myCartProducts[${shopIndex}].products[${productIndex}].number`]: number 
    }, 'number',{
      shopIndex,
      productIndex,
      price: product.price,
      number,
      isChoice: product.isChoice
    })
  },
  shopAllChoiceChange (event) {
    let shopIndex = event.currentTarget.dataset.shopindex;
    let isChoice = !this.data.myCartProducts[shopIndex].isChoice;
    let data = Object.create(null);
    this.data.myCartProducts[shopIndex].products.forEach((v, i) => {
      if (v.isChoice === isChoice) return;
      data[`myCartProducts[${shopIndex}].products[${i}].isChoice`] = isChoice;
    });
    if (isChoice) {
      if (this.checkIsAllChoice(shopIndex))
        data.isAllChoice = true;
    } else {
      if (this.data.isAllChoice)
        data.isAllChoice = false;
    }
    data[`myCartProducts[${shopIndex}].isChoice`] = isChoice;
    this.totalMoneyChange(data, 'shopChoice', {
      shopIndex,
      isChoice
    })
  },
  allChoiceChange () {
    let isChoice = !this.data.isAllChoice;
    let data = Object.create(null);
    let shops = this.data.myCartProducts;
    for (let shopIndex = 0; shopIndex < shops.length; shopIndex ++) {
      let products = shops[shopIndex].products;
      if (shops[shopIndex].isChoice !== isChoice) {
        data[`myCartProducts[${shopIndex}].isChoice`] = isChoice;
      }
      for (let productIndex = 0; productIndex < products.length; productIndex ++) {
        if (products[productIndex].isChoice !== isChoice) {
          data[`myCartProducts[${shopIndex}].products[${productIndex}].isChoice`] = isChoice;
        }
      }
    }
    data.isAllChoice = isChoice;
    this.totalMoneyChange(data, 'allChoice', {isChoice});
  },
  editProducts () {
    let isEdit = !this.data.isEdit;
    let data = {isEdit};
    let shops = this.data.myCartProducts;
    if (isEdit) {
      myCartProductsRecall = {};
      myCartProductsRecall.shops = util.deeplyCopy(shops);
      for (let shop of shops) {
        shop.isChoice = false;
        shop.totalCount = 0;
        for (let product of shop.products) {
          product.isChoice = false;
          product.inventory = product.number;
        } 
      }
      data.myCartProducts = shops;
      data.isAllChoice = false;
      data.totalCount = 0;
    } else {
      this.data.myCartProducts = myCartProductsRecall.shops;
      let shops = this.data.myCartProducts;
      for (let i = 0; i < shops.length; i ++) {
        shops[i].totalMoney = this.computeShopMoney(i);
        shops[i].isChoice = this.checkIsShopChoice(i);
        shops[i].totalCount = this.computeShopCount(i);
      }
      data.myCartProducts = this.data.myCartProducts;
      data.totalCount = this.computeTotalCount();
      data.totalMoney = util.formatPrecision(this.computeTotalMoney());
      data.isAllChoice = this.checkIsAllChoice();
    }
    this.setData(data);
  }, 
  deleteProduct () {
    let shops = this.data.myCartProducts;
    for (let i = 0; i < shops.length; i ++) {
      if (shops[i].isChoice) {
        shops.splice(i, 1, null);
        myCartProductsRecall.shops.splice(i, 1, null);
        continue;
      }
      let products = shops[i].products;
      for (let j = 0; j < products.length; j ++) {
        if (products[j].isChoice) {
          shops[i].totalCount -= products[j].number;
          products.splice(j, 1, null);
          myCartProductsRecall.shops[i].products.splice(j, 1, null);
        }
      }
      shops[i].products = products.filter(v => v !== null);
      myCartProductsRecall.shops[i].products = myCartProductsRecall.shops[i].products.filter(v => v !== null);
    }
    shops = shops.filter(v => v !== null);
    this.data.myCartProducts = shops;
    myCartProductsRecall.shops = myCartProductsRecall.shops.filter(v => v !== null);
    this.setData({
      myCartProducts: shops,
      totalCount: this.computeTotalCount()
    })
  },
  /* 普通方法 */
  checkIsAllChoice (exclusiveIndex = -1) {
    let shops = this.data.myCartProducts;
    for (let i = 0; i < shops.length; i ++) {
      if (i !== exclusiveIndex && !shops[i].isChoice)
        return false;
    }
    return true;
  },
  checkIsShopChoice (shopIndex, exclusiveIndex = -1) {
    let products = this.data.myCartProducts[shopIndex].products;
    for (let i = 0; i < products.length; i ++) {
      if (i !== exclusiveIndex && !products[i].isChoice)
        return false;
    }
    return true;
  },
  totalMoneyChange (data, type, detail = {}) {
    let totalMoney = this.data.totalMoney;
    let totalCount = this.data.totalCount;
    let shop = detail.shopIndex !== undefined ? this.data.myCartProducts[detail.shopIndex] : null;
    // 单个商品选择切换
    if (type === 'choice') {
      if (detail.isChoice) {
        totalMoney += detail.number * detail.price;
        totalCount += detail.number;
        shop.totalMoney += detail.number * detail.price;
        shop.totalCount += detail.number;
      } else {
        totalCount -= detail.number;
        totalMoney -= detail.number * detail.price;
        shop.totalMoney -= detail.number * detail.price;
        shop.totalCount -= detail.number;
      }
    }
    // 商品数量改变
    if (type === 'number' && detail.isChoice) {
      let number = shop.products[detail.productIndex].number;
      totalMoney += (detail.number - number) * detail.price;
      totalCount += detail.number - number;
      shop.totalMoney += (detail.number - number) * detail.price;
      shop.totalCount += detail.number - number;
    }
    // 店铺全选切换
    if (type === 'shopChoice') {
      if (detail.isChoice) {
        let money = this.computeShopMoney(detail.shopIndex, false);
        let count = this.computeShopCount(detail.shopIndex, false);
        totalMoney += money - shop.totalMoney;
        totalCount += count - shop.totalCount;
        shop.totalCount = count;
        shop.totalMoney = money;
      } else {
        totalMoney -= shop.totalMoney;
        totalCount -= shop.totalCount;
        shop.totalMoney = 0;
        shop.totalCount = 0;
      }
    }
    // 全选切换
    if (type === 'allChoice') {
      let shops = this.data.myCartProducts;
      if (detail.isChoice) {
        for (let i = 0; i < shops.length; i ++) {
          shops[i].totalMoney = this.computeShopMoney(i, false);
          shops[i].totalCount = this.computeShopCount(i, false);
        }
        totalMoney = this.computeTotalMoney();
        totalCount = this.computeTotalCount();
      } else {
        for (let i = 0; i < shops.length; i ++) {
          shops[i].totalMoney = 0;
          shops[i].totalCount = 0;
        }
        totalMoney = 0;
        totalCount = 0;
      }
    }

    data.totalMoney = util.formatPrecision(totalMoney);
    data.totalCount = totalCount;
    this.setData(data);
  },
  computeShopMoney (shopIndex, isChoice = true) {
    return this.data.myCartProducts[shopIndex].products.reduce((total, cur) => isChoice ? cur.isChoice ? total + cur.number * cur.price : total : total + cur.number * cur.price, 0);
  },
  computeTotalMoney () {
    return this.data.myCartProducts.reduce((total, cur) => total + cur.totalMoney, 0);
  },
  computeShopCount (shopIndex, isChoice = true) {
    return this.data.myCartProducts[shopIndex].products.reduce((count, cur) => isChoice 
      ? cur.isChoice ? count + cur.number : count 
      : count + cur.number, 0);
  },
  computeTotalCount () {
    return this.data.myCartProducts.reduce((count, cur) => count + cur.totalCount, 0);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = {};
    { 
      let shops = this.data.myCartProducts;
      for (let i = 0; i < shops.length; i ++) {
        shops[i].totalMoney = this.computeShopMoney(i);
        shops[i].isChoice = this.checkIsShopChoice(i);
        shops[i].totalCount = this.computeShopCount(i);
        data[`myCartProducts[${i}].isChoice`] = shops[i].isChoice;
      }
      data.totalCount = this.computeTotalCount();
      data.totalMoney = this.computeTotalMoney();
      data.isAllChoice = this.checkIsAllChoice();
    }
    this.setData(data);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})