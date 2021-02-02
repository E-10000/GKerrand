// index.js
// 获取应用实例
const app = getApp()
import WxValidate from '../../utils/WxValidate.js'
const DB = wx.cloud.database()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    tabIndex: 1,
    list: [],
    form:{
      name:'',
      phone:''
    },
    express:null,
    food:null,
    thing:null,
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
      state:0
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
      state:0
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
      state:0
    }).get({
      success:function(res){
        that.setData({
          thing:res.data
        })
      }
    })
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    this.setData({
      tabIndex: 1
    })
    this.getList()
    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    // app.globalData.userInfo=123;
    console.log(app.globalData.userInfo)
  },
  getUserInfo(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
