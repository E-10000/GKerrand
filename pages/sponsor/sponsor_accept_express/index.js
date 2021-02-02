// pages/runner_food/index.js
const expressCollection = wx.cloud.database().collection("sponsor_express")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    sExpress:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that  = this
    // console.log(options.id)
    this.setData({
      id:options.id
    })
    
    expressCollection.where({
      _id:options.id
    }).get({
      success(res){
        res.data[0].create_time = res.data[0].create_time.toLocaleDateString()
        console.log(res.data)
        that.setData({
          sExpress:res.data
        })
      },fail(res){
        console.log("失败"+res)
      }
    })
  },
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  },
  accept(){
    var that = this
    var user_data = wx.getStorageSync('user_data')

    expressCollection.where({
      _id:that.data.sExpress[0]._id
    }).update({
      data:{
        state:1,
        accept_id:user_data._openid,
        accept_name:user_data.data.name
      },success(){
        
        wx.showModal({
          title: '提示',
          content: '接单成功',
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.switchTab({
                url: '/pages/runner/runner'
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
              wx.switchTab({
                url: '/pages/runner/runner'
              })
            }
          }
        })


      }
    })
  },
  pay(){
    var that = this
    expressCollection.where({
      _id:that.data.sExpress[0]._id
    }).update({
      data:{
        state:3
      },success(res){
        wx.showModal({
          title: '提示',
          content: '支付成功！',
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.switchTab({
                url: '/pages/sponsor/sponsor',
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
              wx.switchTab({
                url: '/pages/sponsor/sponsor',
              })
            }
          }
        })
      }
    })
  },
  out(){
    var that = this
    expressCollection.where({
      _id:that.data.sExpress[0]._id
    }).update({
      data:{
        state:4
      },success(res){
        wx.showModal({
          title: '提示',
          content: '取消成功！',
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.switchTab({
                url: '/pages/sponsor/sponsor',
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
              wx.switchTab({
                url: '/pages/sponsor/sponsor',
              })
            }
          }
        })
      }
    })
  },
  change(e){
      var sexpress = e.currentTarget.dataset.sexpress
      console.log(sexpress)
      // object转化为json格式
      var jsonSexpress = JSON.stringify(sexpress);
      wx.navigateTo({
        url: '/pages/sponsor_express/index?jsonSexpress='+jsonSexpress,
      })
  }
})