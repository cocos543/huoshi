// pages/recitation/recitation.js
var app = getApp();
Page({
  data:{ 
    userInfo:null,
    todayData:null
  },
  onLoad:function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    wx.showToast({
      title: '登录中',
      icon: 'loading',
      duration: 10000,
      complete:function(res){
        console.log('complete');
      }
    });

    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })

      app.getTodyReciting(function(data){
        if (data == null) {
          //表示用户没有选择背诵注意,需要提醒去选择
        }
        that.setData({
            todayData:data
        })
        console.log(data);
        wx.hideToast();
      });
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

  selectBook:function(){
    console.log("book~~~~~~~~")
    wx.navigateTo({
      url: '/pages/recitation/book'
    })
  },

  clickRecite:function(){
      console.log("book~~~~~~~~")
      if (app.checkNeedReciting()) {
        wx.navigateTo({
          url: '/pages/recitation/recite'
        })
      }else {
        wx.navigateTo({
         url: '/pages/recitation/review?isNew=0&load=1'
        })
      }
  },
})