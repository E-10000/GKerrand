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
      identity:'',
      student_id:''
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
    var that = this
    this.setData({
      tabIndex: options.type||1
    })
    this.initValidate()//验证规则函数
    
    wx.getStorage({
      key: 'user_data',
      success(res){
        // console.log(res)
        that.setData({
          form:{
            name:res.data.data.name,
            identity:res.data.data.identity,
            phone:res.data.data.phone,
            student_id:res.data.data.student_id
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
      identity:{
        required:true,
        idcard: true
      },
      student_id:{
        required:true,
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
      identity:{
        required:'请填写身份证号',
        idcard: '请填写正确的身份证号'
      },
      student_id:{
        required:'请填写学生证号',
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },
  //调用验证函数
  formSubmit: function(e) {
    var that = this
    console.log('form发生了submit事件，携带的数据为：', e.detail.value)
    const params = e.detail.value
    //校验表单
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }

    var user_data = DB.collection("user_data")
    var temp_user_data = DB.collection("temp_user_data")
    var openid = wx.getStorageSync('openid');

    //如果图片不是3张的话
    if(that.data.img.length!=3){
      wx.showModal({
        title: '提示',
        content: '请上传3张图片',
        success (res) {
          if (res.confirm) {
            return false
          } else if (res.cancel) {
            return false
          }
        }
      })
    }else{

      //上传图片到存储
      for(let i = 0 ;i < that.data.img.length; i++){
        wx.cloud.uploadFile({//上传到云存储
          cloudPath:openid+'_'+i+'.png',//云端存储路径
          filePath: that.data.img[i], //图片的临时路径
        })
      }

      //先查询temp_user_data是否已经提交过记录了
      temp_user_data.where({
        state:0,
        _openid:openid
      }).get().then(res=>{
        console.log(res.data)
        //如果没有提交过记录，临时表添加记录
        if(res.data[0]==null){
          temp_user_data.add({
            data:{
              state:0,
              data:e.detail.value
            }
          })
        }
        //如果是提交过的话，更新临时表中的提交数据
        if(res.data[0]!=null){
          temp_user_data.where({
            _openid:openid
          }).update({
            data:{
              data:e.detail.value
            },success(res){
              that.showTitle()
            }
          })
        }
        
      })
    }

    
  },
  showTitle(){
    wx.showModal({
      title: '提示',
      content: '提交成功！',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          // wx.redirectTo({
          //   url: '/pages/user_data/index',
          // })
          wx.switchTab({
            url: '/pages/user/user',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
          wx.switchTab({
            url: '/pages/user/user',
          })
        }
      }
    })
  },
  getOpenid(){
    var that = this
    // console.log(getApp().globalData.openid)
    wx.getStorage({
      key: 'openid',
      success(res){
        console.log(res)
        that.setData({
          openid:res.data.openid
        })
      }
    })

  },
  
  uploadImg(){

    var that = this
    var openid = wx.getStorageSync('openid');
    // 让用户选择一张图片
     wx.chooseImage({
    //最多选择多少张
    count: 3,
    //原图与压缩
    sizeType: ['original', 'compressed'],
    //照相或者从相机选择
    sourceType: ['album', 'camera'],
    success:function(e){
      that.setData({
        img:e.tempFilePaths //存图片到img数组
      })
      // for(let i = 0 ;i < e.tempFilePaths.length; i++){
      //   wx.cloud.uploadFile({//上传到云存储
      //     cloudPath:openid+'_'+i+'.png',//云端存储路径
      //     filePath: e.tempFilePaths[i], //图片的临时路径
      //   })
      // }
      wx.showToast({
        title: '上传成功',
      })
      },
      fail:function(){
        wx.showToast({
          title: '上传失败',
        })
      }
    })
  },
  preImg(e){
    var src=e.currentTarget.dataset.src;//获取data-src的值
    //图片预览
    wx.previewImage({
      urls: [src],
    })
  }

})

