// pages/coupon/index.js
import WxValidate from '../../../utils/WxValidate.js'
const app = getApp()

const DB = wx.cloud.database();
const _ = DB.command



Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 1,
    list: [],
    form:{
      name:'',
      phone:''
    },
    express:null,
    food:null,
    thing:null,

    
    list: [{
      id: 1,
      name: '芒果',
      content: "我是张三，见到大家很高兴。。。"
    }, {
      id: 2,
      name: '香蕉',
      content: "我是李四，可以带大将去玩。。。。"

    },{
        id: 3,
        name: '苹果',
        content: "我是王五，我编码贼好。。。。"

      }]
  },
  tabFun(e) {
    if(e.food_name==null){
      console.log
    }

    this.setData({
      tabIndex: e.currentTarget.dataset.index
    })
    // this.getList()
    console.log(e.currentTarget.dataset.index)
    
  },
  getList(){
    this.findExpress()
    this.findFood()
    this.findThing()
  },
  findExpress(){
    var that = this
    var express = DB.collection("sponsor_express")
    var openid = wx.getStorageSync('user_data')._openid
    express.where({
      state:_.or(_.eq(1),_.eq(0),_.eq(2)),
      _openid:openid
    })
    .get({
      success:function(res){
        that.setData({
          express:res.data
        })
      }
    })
  },
  findFood(){
    var that = this
    var food = DB.collection("sponsor_food")
    var openid = wx.getStorageSync('user_data')._openid
    
    food.where({
      // state:_.not(_.eq(2)),
      state:_.or(_.eq(1),_.eq(0),_.eq(2)),
      _openid:openid
    }).get({
      success:function(res){
        that.setData({
          food:res.data
        })
        console.log(that.data.food)
      }
    })
  },
  findThing(){
    var that = this
    var thing = DB.collection("sponsor_thing")
    var openid = wx.getStorageSync('user_data')._openid
    thing.where({
      state:_.or(_.eq(1),_.eq(0),_.eq(2)),
      _openid:openid
    }).get({
      success:function(res){
        that.setData({
          thing:res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      tabIndex: options.type||1
    })
    this.getList()
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
  
  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },

  formReset(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      chosen: ''
    })
  },
    
  //调用验证函数
  formSubmit2: function(e) {
    console.log('form发生了submit事件，携带的数据为：', e.detail.value)
    const params = e.detail.value
    //校验表单
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }
    this.showModal({
      msg: '提交成功'
    })
  },
  foodBindTap(e){
    // console.log(e.currentTarget.dataset.id)
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/runner_food/index?id='+id,
    })
  }

})

