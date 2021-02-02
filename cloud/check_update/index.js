// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()


// 云函数入口函数
exports.main = async (event, context) => {
  var temp_user_data = db.collection("temp_user_data")
  var user_data = db.collection("user_data")
  var id = event.tempid
  var openid = event.openid
  var data = event.data
  
  //更新真正的用户信息表
  user_data.where({
    _openid:openid
  }).update({
    data:{
      data:data
    }
  })

  //然后删除这个临时表
  return temp_user_data.where({
    _id:id
  }).remove()
  

}