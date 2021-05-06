// pages/product/product.js
let globalData = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticPath: globalData.static,
    winWidth: globalData.winWidth,
    safeAreaHeight: globalData.safeArea.top,
    swiperCur: 1,
    swiperCount: 2,
    goodBookCur: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onReady: function () {
    this.setBannerHeight();
  },
  onShow: function () {

  },
  /* 事件方法 */
  swiperChange (e) {
    this.setData({
      swiperCur: e.detail.current + 1
    })
  },
  goodBookChange (e) {
    this.setData({
      goodBookCur: e.detail.current
    })
  },
  /* 普通方法 */
  setBannerHeight () {
    if (globalData.winWidth) return;
    let winWidth = wx.getSystemInfoSync().windowWidth;
    this.setData({winWidth});
  }
})