// pages/cart/cart.js
let util = require('../../utils/util.js');
let globalData = getApp().globalData;
// 
let cartDataBackups = null;
Page({
  // 普通数据
  offset: 0,
  /**
   * 页面的初始数据
   */
  data: {
    staticPath: globalData.static,
    totalMoney: 0,
    totalNumber: 0,
    isAllChoice: false,
    isEdit: false,
    products: [],
    myCartProducts: []
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    this.fetchCart();
    this.fetchBottomProducts();
  },
  onReady: function () {

  },
  onShow: function () {
    if (globalData.cartChange) {
      this.fetchCart();
      globalData.cartChange = false;
    }
  },
  onHide: function () {
    if (this.data.isEdit) {
      this.editEnd();
    }
  },
  onReachBottom () {
    if (this.offset === -1) {
      wx.showToast({
        icon: 'none',
        title: '没有更多了 ~'
      })
      return;
    }
    this.fetchBottomProducts();
  },

  /* 事件方法 */
  addCart (e) {
    wx.showLoading();
    wx.request({
      url: `${globalData.api}/cart/product/${e.detail.pid}`,
      method: 'POST',
      success: res => {
        if (res.statusCode === 400) {
          if (res.data.code === 'product:not_exist')
            wx.showToast({title: '商品不存在,刷新！',icon: 'none'})
          else 
            wx.showToast({title: '未知错误！',icon: 'none'})
          return;
        }
        wx.showToast({title: '添加成功 ~', icon: 'none'});
        this.fetchCart();
      }, 
      fail () {wx.showToast({title: '网络错误！',icon: 'none'})},
      complete() {wx.hideLoading()}
    })
  },
  choiceChange (e) {
    let pid = e.detail.pid;
    let isChoice = e.detail.isChoice;
    let pi = e.currentTarget.dataset.productindex;
    let si = e.currentTarget.dataset.shopindex;
    wx.showLoading();
    wx.request({
      url: `${globalData.api}/cart/product/${pid}`,
      method: 'PUT',
      data: {isChoice},
      success: res => {
        if (res.statusCode === 400) {
          wx.showToast({title: res.data.message, icon: 'none'});
          return;
        }
        this.data.myCartProducts[si].products[pi].isChoice = isChoice;
        this.updateCartView();
      },
      fail () {wx.showToast({title: '网络错误!', icon: 'none'})},
      complete() {wx.hideLoading()}
    })
  },
  numberChange (e) {
    let pi = e.currentTarget.dataset.productindex;
    let si = e.currentTarget.dataset.shopindex;
    let pid = e.detail.pid;
    let number = e.detail.number;

    wx.showLoading();
    wx.request({
      url: `${globalData.api}/cart/product/${pid}`,
      data: {number},
      method: 'PUT',
      success: res => {
        if (res.statusCode === 400) {
          wx.showToast({title: res.data.message, icon: 'none'});
          return;
        }
        this.data.myCartProducts[si].products[pi].number = number;
        this.updateCartView();
      },
      fail () {wx.showToast({title:'网络错误!', icon: 'none'})},
      complete () {wx.hideLoading()}
    })
  },
  shopAllChoiceChange (e) {
    let si = e.currentTarget.dataset.shopindex;
    let shop = this.data.myCartProducts[si];
    let isChoice = !shop.isChoice;
    wx.showLoading();
    wx.request({
      url: `${globalData.api}/cart/shop/${shop.shopId}`,
      data: {isChoice},
      method: 'PUT',
      success: res => {
        if (res.statusCode === 400) {
          wx.showToast({title: res.data.message, icon: 'none'});
          return;
        }
        for (let product of shop.products) {
          product.isChoice = isChoice;
        }
        this.updateCartView();
      },
      fail() {wx.showToast({title: '网络错误!', icon: 'none'})},
      complete() {wx.hideLoading()}
    })
  },
  allChoiceChange () {
    let isChoice = !this.data.isAllChoice;
    let shops = this.data.myCartProducts;
    wx.request({
      url: `${globalData.api}/cart/all`,
      data: {isChoice},
      method: 'PUT',
      success: res => {
        if (res.statusCode === 400) {
          wx.showToast({title: res.data.message, icon: 'none'});
          return;
        }
        for (let shop of shops) {
          for (let product of shop.products)
            product.isChoice = isChoice;
        }
        this.updateCartView();
      },
      fail() {wx.showToast({title: '网络错误!', icon: 'none'})},
      complete() {wx.hideLoading()}
    })
  },
  editProducts () {
    this.data.isEdit = true;
    let shops = this.data.myCartProducts;
    // 备份
    cartDataBackups = util.deeplyCopy(shops);
    // isAllChoice -> false
    for (let shop of shops) {
      for (let p of shop.products) {
        p.isChoice = false;
      }
    }
    this.updateCartView({isEdit: true});
  },
  editEnd () {
    this.data.myCartProducts = cartDataBackups;
    this.data.isEdit = false;
    this.updateCartView({isEdit: false});
  }, 
  deleteProducts () {
    if (this.data.totalNumber === 0)
      return wx.showToast({
        title: '先选择哦 ~', 
        icon: 'none'
      })

    let shops = this.data.myCartProducts;
    let deletes = this.selected();

    let deleteProduct = (shops, deletes) => {
      for (let [shopid, pids] of deletes) {
        let shopIndex = shops.findIndex(v => v.shopId === shopid);
        let list = shops[shopIndex].products;
        if (pids.length === list.length) {
          shops.splice(shopIndex, 1);
          continue;
        }
        for (let pid of pids) {
          list.splice(list.findIndex(v => v.pid === pid), 1);
        }
        if (list.length === 0) shops.splice(shopIndex, 1);
      }
    };

    wx.showLoading();
    wx.request({
      url: `${globalData.api}/cart/delete`, 
      method: 'DELETE',
      data: deletes.reduce((p, c)=> p.concat(c[1]), []),
      success: res => {
        if (res.statusCode === 400) return wx.showToast({title: '未知错误!', icon: 'none'});
        deleteProduct(shops, deletes);
        deleteProduct(cartDataBackups, deletes);
        let isEdit = shops.length ? true : false;
        this.updateCartView({isEdit});
      },
      fail () { wx.showToast({title:'网络错误！', icon: 'none'}) },
      complete () {wx.hideLoading();}      
    })
    return deletes;
  },
  collectProducts () {
    let selected = this.deleteProducts();
  },
  toPay () {
    // wx.request({
    //   url: `${globalData.api}/cart/pay`,
    //   success: res => {
    //     wx.requestPayment()
    //   }
    // })
    wx.requestPayment();
  },
  // 
  /* 普通方法 */
  // 
  updateCartView (data = {}) {
    if(!this.data.isEdit)
      this.updateAll(data)
    else 
      this.updateEdit(data)
  },
  updateAll (data) {
    let shops = this.data.myCartProducts;
    let totalMoney = 0;
    let totalNumber = 0;
    let isAllChoice = true;
    for (let shop of shops) {
      let isChoice = true;
      let money = 0;
      let number = 0;
      for (let product of shop.products) {
        if (!product.isChoice) {
          isChoice = false;
          continue;
        }
        money += product.price * product.number;
        number += + product.number;
      }
      shop.isChoice = isChoice;
      shop.totalMoney = money;
      shop.totalNumber = number;
      // 
      if (isChoice === false) isAllChoice = false;
      totalMoney += money;
      totalNumber += number;
    }
    this.setData({
      isAllChoice,
      totalNumber,
      totalMoney: util.formatPrecision(totalMoney),
      myCartProducts: shops,
      ...data
    })
  },
  updateEdit (data) {
    let shops = this.data.myCartProducts;
    let totalNumber = 0;
    let isAllChoice = true;
    for (let shop of shops) {
      let isChoice = true;
      let number = 0;
      for (let product of shop.products) {
        if (!product.isChoice) {
          isChoice = false;
          continue;
        }
        number ++;
      }
      shop.isChoice = isChoice;
      shop.totalNumber = number;
      // 
      if (isChoice === false) isAllChoice = false;
      totalNumber += number;
    }
    this.setData({
      isAllChoice,
      totalNumber,
      myCartProducts: shops,
      ...data
    })
  },
  selected () {
    let shops = this.data.myCartProducts;
    // [[shopid, [pid, pid]]]
    let result = [];
    for (let shop of shops) {
      let shopId = shop.shopId;
      let pArr = [];
      for (let product of shop.products) {
        if (!product.isChoice) continue;
        pArr.push(product.pid);
      }
      if (pArr.length) result.push([shopId, pArr]);
    }

    return result;
  }, 
  formatCart (shops) {
    for (let shop of shops) {
      for (let p of shop.products) {
        p.curPrice = p.price.split('.');
        p.keyword = p.keywords.find(v => v.importance).keyword;
      }
    }
    return shops;
  },
  fetchCart () {
    wx.showLoading();
    wx.request({
      url: `${globalData.api}/cart`,
      success: res => {
        let myCartProducts = this.formatCart(res.data.myCartProducts);
        this.data.myCartProducts = myCartProducts;
        this.updateCartView({myCartProducts});
      },
      fail () {
        wx.showToast({
          icon: 'none',
          title: '网络错误!'
        })
      }, 
      complete () {
        wx.hideLoading();
      }
    })
  },
  fetchBottomProducts() {
    wx.showLoading();
    wx.request({
      url: `${globalData.api}/index/products/${this.offset}/6`,
      success: res => {
        if (res.statusCode === 400) {
          if (res.data.code === 'products:no_more') {
            wx.showToast({
              icon: 'none',
              title: '没有更多了 ~'
            })
            this.offset = -1;
          }
          return;
        }
        let products = res.data.products;
        products = this.data.products.concat(products);
        this.setData({
          products
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '网络错误!'
        })
      },
      complete () {
        wx.hideLoading();
      }
    })
    this.offset += 6;
  }
})