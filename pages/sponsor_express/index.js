// pages/coupon/index.js
import WxValidate from '../../utils/WxValidate.js'
const DB = wx.cloud.database()

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 1,
    list: [],
    //表单验证要加的
    form:{
      name:'',
      phone:'',
      code:'',
      deposit:'',
      msg: '',
      place:'',
      remarks:'',
      reward_amount:'',
      create_time:'',
      source_point:''
    }
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
    app.http('/v1/order/list', { state: this.data.tabIndex }).then(res => {
      this.setData({list:res.data})
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      tabIndex: options.type||1
    })
    
    if(options.jsonSexpress!=null){
      var jsonSexpress = JSON.parse(options.jsonSexpress)
      console.log(jsonSexpress)    
      this.setData({
        form:jsonSexpress.express,
        jsonSexpress:jsonSexpress,
        change:true
      })
    }

    this.initValidate()//验证规则函数

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
  

  formReset(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      chosen: ''
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
      name: {
        required: true,
        minlength:2
      },
      phone:{
        required:true,
        tel:true //记得改回来！
      },
      msg:{
        required:true,
      },
      code:{
        required:true,
      },
      place:{
        required:true,
      },
      deposit:{
        required:true,
        number: true
      },
      reward_amount:{
        required:true,
        number: true
      },
      source_point:{
        required:true
      }
      
    }
    const messages = {
      name: {
        required: '请填写姓名',
        minlength:'请输入正确的名称'
      },
      phone:{
        required:'请填写手机号',
        tel:'请填写正确的手机号'
      },
      msg:{
        required:'请填写原信息',
      },
      code:{
        required:'请填写取件码',
      },
      place:{
        required:'请填写正确的地址',
      },
      deposit:{
        required:'请填写押金',
        number: '请填写正确的押金'
      },
      reward_amount:{
        required:'请填写悬赏金额',
        number: '请填写正确的悬赏金额'
      },
      source_point:{
        required:'请填写取件点'
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },
  //调用验证函数
  formSubmit: function(e) {
    var that = this
    console.log('form发生了submit事件，携带的数据为：', e.detail.value)
    const params = e.detail.value
    var sponsor_express = DB.collection("sponsor_express")

    //校验表单
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }
    //接下来是通往数据库的代码
    this.data.form.create_time=new Date();

    //如果是做出改变的话
    if(this.data.change==true){
      sponsor_express.where({
        _id:that.data.jsonSexpress._id
      }).update({
        data:{
          create_time:new Date(),
          express: e.detail.value
        },
        success(res){
          console.log("修改成功",res)
        }
      })
  
      wx.showModal({
        title: '提示',
        content: '修改成功！',
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

    else{
      sponsor_express.add({
        data:{
          state:0,
          express: e.detail.value,
          create_time:new Date()
        },
        success(res){
          console.log("添加成功",res)
        }
      })
      wx.showModal({
        title: '提示',
        content: '提交成功！',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateBack()
          } else if (res.cancel) {
            console.log('用户点击取消')
            wx.navigateBack()
          }
        }
      })
    }
    

   

    
  }

})

