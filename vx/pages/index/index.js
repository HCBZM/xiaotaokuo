// index.js
const productsListMap = new Map;
const globalData = getApp().globalData;
const initialData = {
  productsTabIndex: 0,
  offset: 6
};

Page({
  data: {
    urlOrigin: globalData.origin,
    staticPath: globalData.static,
    bannerHeight: '0px',
    cardProgressbar: '0%',
    isSticky: false,
    productsTabs: [],
    anchorScrollTop: 0
  },
  // 事件 
  addCart (e) {
    let pid = e.currentTarget.dataset.pid;
    wx.showLoading();
    wx.request({
      url: `${globalData.api}/cart/product/${pid}`,
      method: 'POST',
      success: res => {
        if (res.statusCode === 400) {
          if (res.data.code === 'product:not_exist')
            wx.showToast({title: '商品不存在,刷新！',icon: 'none'})
          else 
            wx.showToast({title: '未知错误！',icon: 'none'})
          return;
        }
        wx.showToast({
          title: '添加成功'
        })
        globalData.cartChange = true;
      }, 
      fail () {
        wx.showToast({
          icon: 'none',
          title: '网络错误！'
        })
      },
      complete () {
        wx.hideLoading();
      }
    })
  },
  cardScroll (e) {
    let len = this.data.cards.length / 2;
    let progress = e.detail.scrollLeft / (e.detail.scrollWidth * 5 / len) * 100;
    this.setData({
      cardProgressbar: progress + '%'
    })
  },
  toSearchPage () {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  toggleProducts (event) {
    let index = event.currentTarget.dataset.index;
    if (index === this.data.productsTabIndex) return;
    let setProducts = () => {
      if (productsListMap.has(index)) {
        this.setData({
          productsTabIndex: index,
          products: productsListMap.get(index)
        })
        return;
      }

      wx.showLoading({
        title: '加载中 ~',
      })
      wx.request({
        url: `${globalData.api}/index/products/${this.data.offset}/6`,
        success: (res) => {
          let products = this.formatProducts(res.data.products);
          productsListMap.set(index, products);
          this.setData({
            products,
            productsTabIndex: index
          });
        },
        fail () {
          wx.showToast({
            title: '网络错误！',
            icon: 'none'
          })
        },
        complete () {
          wx.hideLoading();
        }
      })
      this.data.offset += 6;
    }
    if (this.data.isSticky) this.setAnchorTop(setProducts)
    else setProducts();
  },
  // 生命周期 & 事件
  onReady () {
    this.setBannerHeight();
    this.intersectionListen();
  },
  onLoad () {  
    this.firstInitLoad();
  },
  onReachBottom (e) {
    let index = this.data.productsTabIndex;
    let products = this.data.products;
    wx.showLoading({
      title: '稍等哦 ~'
    })
    wx.request({
      url: `${globalData.api}/index/products/${this.data.offset}/6`,
      success: res => {
        if (res.statusCode === 400) {
          wx.showToast({
            title: `${res.data.message} ~`,
            icon: 'none'
          })
          return;
        }
        products = products.concat(this.formatProducts(res.data.products));
        productsListMap.set(index, products);
        this.setData({products})
      },
      fail () {
        wx.showToast({
          title: '网络错误！',
          icon: 'none'
        })
      },complete() {wx.hideLoading();}
    })
    this.data.offset += 6;
  },
  onPullDownRefresh () {
    wx.startPullDownRefresh();
    this.firstInitLoad(() => {
      wx.stopPullDownRefresh();
    });
  },
  // 方法
  setAnchorTop (cb) {
    console.log(1, this.data.anchorScrollTop);
    if (this.data.anchorScrollTop) {
      wx.pageScrollTo({
        scrollTop: this.data.anchorScrollTop,
        duration: 0,
        success: cb
      })
      return;
    }
    wx.pageScrollTo({
      selector: '#anchor',
      duration: 0,
      success: res => {
        let query = wx.createSelectorQuery();
        query.select('#search').boundingClientRect()
        query.selectViewport().scrollOffset();
        query.exec(res => {
          let scrollTop = res[1].scrollTop - res[0].height + 3;
          this.data.anchorScrollTop = scrollTop;
          console.log(2,res[1].scrollTop,res[0].height, scrollTop);
          wx.pageScrollTo({scrollTop, duration: 0, success: cb})
        })
      }
    })
  },
  firstInitLoad (cb) {
    wx.showLoading({
      title: '加载中 ~',
    })
    wx.request({
      url: `${globalData.api}/index`,
      success: (res) => {
        let data = res.data;
        let products = this.formatProducts(data.products);
        productsListMap.set(initialData.productsTabIndex, products);
        this.setData({
          ...initialData,
          banners: data.banners,
          cards: data.cards,
          activities: {groupBuy: data.groupBuy},
          productsTabs: data.productsTabs,
          products
        })
      },
      complete() {
        wx.hideLoading();
        cb && cb();
      },
      fail (err) {
        wx.showToast({
          title: '网络错误！',
          icon: 'error'
        })
      }
    })
  },
  setBannerHeight () {
    let winWith = wx.getSystemInfoSync().windowWidth;
    let height = 0.3125 * winWith;
    this.setData({
      bannerHeight: height + 'px'
    })
  },
  intersectionListen () {
    let observer = wx.createIntersectionObserver().relativeTo('.search-wrapper', {bottom: 3});
    observer.observe('#categroies', res => {
      if (res.boundingClientRect.top < 48) {
        this.setData({
          isSticky: true
        })
      } else {
        this.setData({
          isSticky: false
        })
      }
    })
  },
  formatProducts (products) {
    products.map(v => {
      v.curPrice = v.price.split('.');
      return v;
    })
    return products;
  }
})
