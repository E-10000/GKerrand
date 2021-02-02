// pages/runner_food/index.js
const thingCollection = wx.cloud.database().collection("sponsor_thing")
import WxValidate from '../../../utils/WxValidate.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    sThing:null,
    // form:{
    //   buy_food_money:''
    // }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initValidate()
    var that  = this
    // console.log(options.id)
    this.setData({
      id:options.id
    })
    
    thingCollection.where({
      _id:options.id
    }).get({
      success(res){
        res.data[0].create_time = res.data[0].create_time.toLocaleDateString()
        that.setData({
          sThing:res.data
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
  
  
  complete: function(e) {

    var id = this.data.sThing[0]._id
    var that = this

    // thingCollection.where({
    //   _id:id
    // })
    // .update({
    //   data:{
    //     state:2,
    //     complete_time:new Date()
    //     // buy_food_money:e.detail.value.buy_food_money
    //   },
    //   success(res){
    //     console.log("添加成功",res)
    //   }
    // })

    wx.cloud.callFunction({
      name:'runner_complete',
      data:{
        state:2,
        complete_time:new Date(),
        id:that.data.sThing[0]._id,
        type:3
      },success(res){
        console.log("添加成功",res)
      },fail(res){
        console.log("失败",res)
      }
    })

    wx.showModal({
      title: '提示',
      content: '提交成功！',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.switchTab({
            url: '/pages/runner/runner',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
          wx.switchTab({
            url: '/pages/runner/runner',
          })
        }
      }
    })

  },

      
  //报错 
  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
  },
  //验证函数
  initValidate() {
    const rules = {
      buy_food_money: {
        required: true
      }
      
    }
    const messages = {
      buy_food_money: {
        required: '请填写买饭钱'
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },

})