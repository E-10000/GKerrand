// app.js
App({
  onLaunch() {
    var that = this
    //云开发
    wx.cloud.init({
      env:"errand-9g43qz8bd2f1d0a1",
      traceUser: true//将用户访问记录到用户管理中
    })
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // console.log(this.globalData.userInfo)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    //获取个人信息
    wx.cloud.callFunction({
      name:"userInfo",
      success(res){
        wx.cloud.callFunction({
          name:"getOpenid",
          success(res1){
            console.log(res1.result.openid)
            //未填写资料，就记录ID
            wx.setStorage({
              data: res1.result.openid,
              key: 'openid',
            })
          }
        })

        if(res.result.user_data!=null){
          console.log(res.result.user_data)
          wx.setStorage({
            data: res.result.user_data,
            key: 'user_data',
          })
        }
        
      },fail(res){
        console.log("失败",res)
      }
    })

    
  },
  globalData: {
    userInfo: null,
    openid: null,
    appid: null
  }
})
