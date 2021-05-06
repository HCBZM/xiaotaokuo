// components/productCard/productCard.js
const globalData = getApp().globalData;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    productData: null
  },

  /**
   * 组件的初始数据
   */
  data: {
    staticPath: globalData.static,
    isShowPrevPrice: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    addCart () {
      this.triggerEvent('addCart', {pid: this.data.productData.pid});
    }
  },
  options: {
    styleIsolation: 'apply-shared'
  }
})
