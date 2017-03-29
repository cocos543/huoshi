// pages/recitation/recite.js
var app = getApp();

Page({
  data:{
    topicData:null,
    count:0,

  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      topicData:app.globalData.todayReciteData,
    });

  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },

  clickDone:function(){
    console.log("book~~~~~~~~")
    wx.navigateTo({
      url: '/pages/recitation/review?isNew=1'
    })
  },

  clickIgnored:function(){
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定忽略当前内容吗?',
      confirmColor:'#000000',
      success: function(res) {
        if (res.confirm) {
          wx.showToast({
            title: '请稍后',
            icon: 'loading',
            mask: true,
            duration: 10000,
          });

          app.setIngroneReciting(function(code) {
            if(code == 200 || code == 451) {
              //忽略成功,重新拉取数据
              app.getTodyReciting(function(data){
                if (data == null) {
                  //没有新增背诵了,进入复习界面
                  wx.navigateTo({
                    url: '/pages/recitation/review?isNew=0&load=1'
                  });
                }else {
                  that.setData({
                    topicData:data
                  })
                }
                wx.hideToast();
              });
            }
          }, that.data.topicData);
        }
      }
    })
  },

  clickCount:function(){
    var count = this.data.count + 1;
    this.setData({
      count:count,
    });
  }
})



