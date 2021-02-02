// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  var that = this
  const wxContext = cloud.getWXContext()
  
  //查询数据库
  await db.collection('user_data').where({
    _openid:wxContext.OPENID
  }).get().then(res => {
    user_data = res.data[0]
  })

  return {
    user_data,
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID
  }
}