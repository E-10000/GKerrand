// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()


// 云函数入口函数
exports.main = async (event, context) => {
  var temp_user_data = db.collection("temp_user_data")
  var id = event.tempid

    //删除这个临时表
    return temp_user_data.where({
      _id:id
    }).remove()
}