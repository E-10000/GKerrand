// pages/runner_food/index.js
const foodCollection = wx.cloud.database().collection("sponsor_food")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    sFood:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    var user_data = wx.getStorageSync('user_data')
    //当没有填资料的时候
    if(user_data.data==null){
      wx.showModal({
        title: '提示',
        content: '你还没有完善个人资料，无法查看跑跑与接单，请前往“我的-个人信息”完善资料，',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.switchTab({
              url: '/pages/user/user',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        }
      })
    }

    var that  = this
    // console.log(options.id)
    this.setData({
      id:options.id
    })
    
    foodCollection.where({
      _id:options.id
    }).get({
      success(res){
        res.data[0].create_time = res.data[0].create_time.toLocaleDateString()
        that.setData({
          sFood:res.data
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
    

    wx.cloud.callFunction({
      name:'accept_update',
      data:{
        state:1,
        accept_id:user_data._openid,
        accept_name:user_data.data.name,
        accept_phone:user_data.data.phone,
        id:that.data.sFood[0]._id,
        type:1
      },success(res){
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


  }
})