// pages/runner_food/index.js
const temp_user_data = wx.cloud.database().collection("temp_user_data")
import WxValidate from '../../../utils/WxValidate.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    user_data:null,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var user_data = wx.getStorageSync('user_data')
    var that  = this
    //设置当前编号
    this.setData({
      id:options.id
    })
    //得到数据
    temp_user_data.where({
      _id:options.id
    }).get({
      success(res){
        //设值显示
        that.setData({
          user_data:res.data
        })
        
        //得到照片数据1
        wx.cloud.downloadFile({
          fileID: 'cloud://errand-9g43qz8bd2f1d0a1.6572-errand-9g43qz8bd2f1d0a1-1304807663/'+that.data.user_data[0]._openid+'_0.png', // 文件 ID
          success: res => {
            //设值
            that.setData({
              img1:res.tempFilePath
            })
            // 返回临时文件路径
            // console.log(res.tempFilePath)
          },
          fail: console.error
        })

        //得到照片数据2
        wx.cloud.downloadFile({
          fileID: 'cloud://errand-9g43qz8bd2f1d0a1.6572-errand-9g43qz8bd2f1d0a1-1304807663/'+that.data.user_data[0]._openid+'_1.png', // 文件 ID
          success: res => {
            //设值
            that.setData({
              img2:res.tempFilePath
            })
            // 返回临时文件路径
            // console.log(res.tempFilePath)
          },
          fail: console.error
        })

        //得到照片数据3
        wx.cloud.downloadFile({
          fileID: 'cloud://errand-9g43qz8bd2f1d0a1.6572-errand-9g43qz8bd2f1d0a1-1304807663/'+that.data.user_data[0]._openid+'_2.png', // 文件 ID
          success: res => {
            //设值
            that.setData({
              img3:res.tempFilePath
            })
            // 返回临时文件路径
            // console.log(res.tempFilePath)
          },
          fail: console.error
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
  //报错 
  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
  },
  pass(){
    var that = this
    wx.cloud.callFunction({
      name:"check_update",
      data:{
        tempid:that.data.user_data[0]._id,//临时表的)id
        openid:that.data.user_data[0]._openid,//要更新的用户ID
        data:that.data.user_data[0].data//即将更新的数据
      },
      success(res){
        console.log("添加成功",res)
        wx.showToast({
          title: '操作成功！', // 标题
          icon: 'success',  // 图标类型，默认success
          duration: 1000  // 提示窗停留时间，默认1500ms
        })
        setTimeout(function(){
          wx.navigateBack()
          wx.redirectTo({
            url: '/pages/admin/admin_list/index',
          })
        },1000)
        
      },
      fail(res){
        console.log("失败",res)
      }
    })
  },
  out(){
    var that = this
    wx.cloud.callFunction({
      name:"check_out",
      data:{
        tempid:that.data.user_data[0]._id,//临时表的)id
      },
      success(res){
        console.log("删除成功",res)
        wx.showToast({
          title: '操作成功！', // 标题
          icon: 'success',  // 图标类型，默认success
          duration: 1000  // 提示窗停留时间，默认1500ms
        })
        setTimeout(function(){
          wx.navigateBack()
          wx.redirectTo({
            url: '/pages/admin/admin_list/index',
          })
        },1000)
        
      },
      fail(res){
        console.log("失败",res)
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