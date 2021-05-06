// components/cartProduct/cartProduct.js
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
    staticPath: globalData.static
  },
  // 生命周期
  attached () {
  },
  /**
   * 组件的方法列表
   */
  methods: {
    toggleChoice () {
      this.triggerEvent('choicechange', {
        pid: this.data.productData.pid,
        isChoice: !this.data.productData.isChoice
      });
    },
    numberChange (event) {
      let number = event.detail.number;
      this.triggerEvent('numberchange', {
        number: number,
        pid: this.data.productData.pid
      });
    }
  },
  options: {
    styleIsolation: 'apply-shared'
  }
})