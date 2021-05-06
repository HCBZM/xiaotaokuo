// pages/mine/mine.js
const globalData = getApp().globalData;

Page({
  /* 普通数据 */
  offset: 6,
  /**
   * 页面的初始数据
   */
  data: {
  },
  /**
   * 生命周期函数
   */
  onLoad: function (options) {
    wx.showLoading();
    wx.request({
      url: `${globalData.api}/mime`,
      success: res => {
        let data = res.data;
        this.setData({
          products: data.products
        })
      },
      fail () { wx.showToast({title:'网络错误！', icon: 'none'}) },
      complete () { wx.hideLoading() }
    })
  },
  onReady: function () {

  },
  onReachBottom () {
    if (this.offset === -1)
      return wx.showToast({title: '没有更多了！', icon: 'none'})

    wx.showLoading();
    wx.request({
      url: `${globalData.api}/index/products/${this.offset}/6`,
      success: res => {
        if (res.statusCode === 400) {
          wx.showToast({icon: 'none', title: res.data.message});
          return;
        }
        let products = res.data.products;
        this.setData({
          products: this.data.products.concat(products)
        })
      },
      fail () { wx.showToast({title:'网络错误！', icon: 'none'}) },
      complete () { wx.hideLoading() }
    })
    this.offset += 6;
  },
  /* 事件函数 */
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
        globalData.cartChange = true;
        wx.showToast({title: '添加成功 ~', icon: 'none'});
      },
      fail () {wx.showToast({title: '网络错误！',icon: 'none'})},
      complete() {wx.hideLoading()}
    })
  }
  /* 普通函数 */
})