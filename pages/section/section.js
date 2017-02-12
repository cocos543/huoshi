//index.js
var util = require('../../utils/util.js')
let app = getApp();
Page({
  data: {
    name : '',  
    volumeId : '',
    section : '',
    total : 0,
    data : []
    
  },

  handleGoToSection : function(event){
    let data = this.data;
    let isNext = event.target.dataset.isnext;
    let disabled = event.target.dataset.disabled;
    if(disabled) return;

    wx.redirectTo({
      url: './section?section='+ (isNext ? data.section + 1 : data.section - 1) + '&name=' + data.name + '&volumeId=' + data.volumeId + '&total=' + data.total
    });
  },
  
  onLoad : function(options){

    this.setData({
      name : options.name,
      volumeId : options.volumeId,
      section : options.section - 0,
      total : options.total - 0
    })

    wx.setNavigationBarTitle({
      title: `${options.name} ${options.section}章`
    });

    wx.request({
      url:`https://www.huoshi.im/bible/frontend/web/index.php/v1/wechat/lection?volume_id=${options.volumeId}&chapter_no=${options.section}`,
        success: (res)=>{
          this.setData({
            data : res.data.data
          })
        },
        fail:function(err){
            console.log(err)
        }
    })
    
  }
})
