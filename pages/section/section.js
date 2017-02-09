//index.js
var util = require('../../utils/util.js')
let app = getApp();
Page({
  data: {
    name : '',  
    volumeId : '',
    section : '',
    data : []
    
  },
  
  onLoad : function(options){
    wx.setNavigationBarTitle({
      title: `${options.name} ${options.section}章`
    })

    wx.request({
      url:`https://www.huoshi.im/bible/frontend/web/index.php/v1/wechat/lection?volume_id=${options.volumeId}&chapter_no=${options.section}`,
        success: (res)=>{
          console.log(res)
          this.setData({
            name : options.full_name,
            volumeId : options.volumeId,
            section : options.section,
            data : res.data.data
          })
        },
        fail:function(err){
            console.log(err)
        }
    })
    
  }
})
