// pages/user_data/index.js
const DB = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var openid = wx.getStorageSync('openid');
    var that = this

    
    //获取个人信息
    wx.cloud.callFunction({
      name:"userInfo",
      success(res){
        //如果未填写资料，就记录ID
        if(res.result.user_data==null){
          //如果数据不存在，那就找到这个ID
          wx.cloud.callFunction({
            name:"getOpenid",
            success(res1){
              //未填写资料，就记录ID
              wx.setStorage({
                data: res1.result.openid,
                key: 'openid',
              })
            }
          })
        }
        //填写了资料
        else{
          console.log(res)
          wx.setStorage({
            data: res.result.user_data,
            key: 'user_data',
          })
          that.setData({
            user_data:res.result.user_data
          })
        }
      },fail(res){
        console.log("失败",res)
      }
    })

    var temp_user_data = DB.collection("temp_user_data")
    //看看是否有审核的东西
    temp_user_data.where({
      _openid:openid,
      state:0
    }).get().then(res=>{
      //如果有，isCheck为真
      if(res.data[0]!=null){
        that.setData({
          isCheck:true
        })
      }
    })


    var that = this
    wx.getStorage({
      key: 'user_data',
      success(res){
        // console.log(res.data)
        that.setData({
          user_data:res.data
        })
      },fail(res){
        wx.getStorage({
          key: 'openid',
          success(res){
            // console.log(res.data)
          }
        })
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
  change(){
    wx.navigateTo({
      url: '/pages/user_data_edit/index',
    })    

  },

})