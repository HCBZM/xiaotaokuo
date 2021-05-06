// pages/category/category.js
let util = require('../../utils/util.js');
let globalData = getApp().globalData;
let tabContents = Array(23).fill([
  {
    type: 'productsCard',
    title: '榜单',
    contents: [
      {id: 1, imgSrc: '/images/product/1.jpg', text: '童书畅销榜'},
      {id: 2, imgSrc: '/images/product/2.jpg', text: '童书新书榜'},
      {id: 3, imgSrc: '/images/product/3.jpg', text: '0-2岁榜'},
      {id: 4, imgSrc: '/images/product/4.jpg', text: '3-6岁榜'},
      {id: 5, imgSrc: '/images/product/5.jpg', text: '7-8岁榜'},
      {id: 6, imgSrc: '/images/product/6.jpg', text: '11-14岁榜'}
    ]
  }, {
    type: 'classificationCard',
    title: '按内容分类',
    showAll: false,
    contents: [
      {id: 1, text: '中国儿童文学'},
      {id: 2, text: '外国儿童文学'},
      {id: 3, text: '绘本'},
      {id: 4, text: '科普/百科'},
      {id: 5, text: '婴儿读物'},
      {id: 6, text: '幼儿启蒙'},
      {id: 7, text: '益智游戏'},
      {id: 8, text: '玩具书'},
      {id: 9, text: '动漫/卡通'},
      {id: 10, text: '少儿英语'},
      {id: 11, text: '进口儿童书'},
      {id: 12, text: '励志/成长'},
      {id: 13, text: '阅读工具书'},
      {id: 14, text: '少儿期刊'},
    ]
  }, {
    type: 'listCard',
    title: '热门书单',
    contents: [
      {id: '1', text: '跟着绘本学数学'},
      {id: '1', text: '凯迪克奖作品合集'},
      {id: '1', text: '让孩子学会躲避危险 儿童安全教育看这里'}
    ]
  }, {
    type: 'classificationCard',
    title: '0-2岁',
    showAll: false,
    contents: [
      {id: 1, text: '画图故事'},
      {id: 2, text: '认知'},
      {id: 3, text: '益智游戏'},
      {id: 4, text: '纸板书'},
      {id: 5, text: '艺术课堂'},
      {id: 6, text: '童谣'},
      {id: 7, text: '入园准备'}
    ]
  }
]);
tabContents[1] = [
  {
    type: 'classificationCard',
    title: '按内容分类',
    showAll: false,
    contents: [
      {id: 7, text: '益智游戏'},
      {id: 8, text: '玩具书'},
      {id: 9, text: '动漫/卡通'},
      {id: 10, text: '少儿英语'},
      {id: 11, text: '进口儿童书'},
      {id: 12, text: '励志/成长'},
      {id: 13, text: '阅读工具书'},
      {id: 14, text: '少儿期刊'},
    ]
  }, {
    type: 'productsCard',
    title: '榜单',
    contents: [
      {id: 1, imgSrc: '/images/product/1.jpg', text: '童书畅销榜'},
      {id: 2, imgSrc: '/images/product/2.jpg', text: '童书新书榜'},
      {id: 3, imgSrc: '/images/product/3.jpg', text: '0-2岁榜'},
      {id: 4, imgSrc: '/images/product/4.jpg', text: '3-6岁榜'},
      {id: 5, imgSrc: '/images/product/5.jpg', text: '7-8岁榜'},
      {id: 6, imgSrc: '/images/product/6.jpg', text: '11-14岁榜'}
    ]
  }, {
    type: 'listCard',
    title: '热门书单',
    contents: [
      {id: '1', text: '跟着绘本学数学'},
      {id: '1', text: '凯迪克奖作品合集'},
      {id: '1', text: '让孩子学会躲避危险 儿童安全教育看这里'}
    ]
  }, {
    type: 'classificationCard',
    title: '0-2岁',
    showAll: false,
    contents: [
      {id: 1, text: '画图故事'},
      {id: 2, text: '认知'},
      {id: 3, text: '益智游戏'},
      {id: 4, text: '纸板书'},
      {id: 5, text: '艺术课堂'},
      {id: 6, text: '童谣'},
      {id: 7, text: '入园准备'}
    ]
  }
]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticPath: globalData.static,
    pageHeight: 0,
    tabIndex: 2,
    refreshScroll: 0,
    tabs: [
      { title: '热搜推荐' },  { title: '精品好店' },  { title: '图书' },  { title: '童书' },  { title: '创意文具' },  { title: '二手旧书' },  { title: '女装' },  { title: '男装' },  { title: '男女鞋' },  { title: '童装童鞋' },  { title: '内衣配饰' },  { title: '母婴玩具' },  { title: '食品生鲜' },  { title: '美妆个护' },  { title: '手机数码' },  { title: '电脑办公' },  { title: '家用电器' },  { title: '运动户外' },  { title: '珠宝饰品' },  { title: '家居家纺' },  { title: '厨房用品' },  { title: '汽车用品' },  { title: '家居家装' }], 
    tabContent: []
  },

  // 自定义事件响应函数
  changeTab (event) {
    let index = event.target.dataset.index;
    this.setData({
      tabIndex: index,
      tabContent: tabContents[index],
      refreshScroll: 0
    })
  },
  classificationToggle (event) {
    let index = event.currentTarget.dataset.pos;
    console.log(event)
    let showAll = this.data.tabContent[index].showAll;
    this.setData({
      [`tabContent[${index}].showAll`]: !showAll
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let tabContent = tabContents[this.data.tabIndex];
    this.setData({
      tabContent
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    try {
      const res = wx.getSystemInfoSync()
      this.setData({
        pageHeight: res.windowHeight
      })
    } catch (e) {
      this.setData({
        pageHeight: 500
      })
    }
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