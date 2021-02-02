// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()


// 云函数入口函数
exports.main = async (event, context) => {

  var id = event.accept_id;
  var name = event.accept_name;
  var phone = event.accept_phone;

  //如果是更新外卖表
  if(event.type==1){
    return await db.collection("sponsor_food").where({
      _id:event.id
    }).update({
      data:{
        state:1,
        accept_id:id,
        accept_name:name,
        accept_phone:phone
      }
    })
  }
    //如果是更新快递表
    if(event.type==2){
      return await db.collection("sponsor_express").where({
        _id:event.id
      }).update({
        data:{
          state:1,
          accept_id:id,
          accept_name:name,
          accept_phone:phone
        }
      })
    }
    //如果是更新东西表
    if(event.type==3){
      return await db.collection("sponsor_thing").where({
        _id:event.id
      }).update({
        data:{
          state:1,
          accept_id:id,
          accept_name:name,
          accept_phone:phone
        }
      })
    }




 
}