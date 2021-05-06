// app.js
App({
  onLaunch() {
    // system info 
    wx.getSystemInfo({
      success: (result) => {
        this.globalData.winWidth = result.windowWidth;
        this.globalData.safeArea = result.safeArea;
      }
    })
    // 登录
    wx.login({
      success: res => {
        // console.log(res)
      }
    })
    wx.checkSession({
      success (res) {
        // console.log('success', res)
      },
      fail (err) {
        console.log(err)
      }
    })
    // wx.chooseAddress({
    //   success(res) {
    //     console.log(res)
    //   },
    //   complete(){

    //   },
    //   fail (err) {
    //     console.log(err)
    //   }
    // })
  },
  globalData: {
    origin: 'http://192.168.2.4:3333',
    api: 'http://192.168.2.4:3333/api',
    static: 'http://192.168.2.4:3333/static',
    userInfo: null,
    cartChange: false,
  }
})
