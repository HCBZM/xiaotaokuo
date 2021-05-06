// components/cartNumberBtn/cartNumberBtn.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    number: null,
    inventory: null
  },

  /**
   * 组件的初始数据
   */
  data: {
    showInput: false
  },

  // 生命周期
  attached: function() {
  },
  /**
   * 组件的方法列表
   */
  methods: {
    inputToggle () {
      this.setData({
        showInput: true
      })
    },
    confirm (event) {
      let value = event.detail.value;
      let realVal = !value.match(/^[0-9]+$/) ? 1 : Number(value);
      this.setNumber(realVal);
    },
    changeNumber (event) {
      let flag = event.currentTarget.dataset.flag;
      let number = Number(this.data.number);
      number = flag === '-' ? number - 1 : number + 1;
      this.setNumber(number);
    },
    setNumber (number) {
      this.setData({
        showInput: false
      })
      number = number > this.data.inventory ? this.data.inventory : number;
      number = number < 1 ? 1 : number;
      if(number === Number(this.data.number)) return;
      this.triggerEvent('change', { number });
    }
  },
  options: {
    styleIsolation: 'apply-shared'
  }
})
