// pages/recitation/recitation.js
import { $wuxToast } from "../../wuxui/components/wux"

var app = getApp();
Page({
  data:{ 
    userInfo:null,
    todayData:null
  },

  onShareAppMessage: function () {
    return {
      title: "我正在背圣经",
      path: '/page/recitation/recitation',
      success: function(res) {
        // 分享成功
      },
      fail: function(res) {
        // 分享失败
      }
    }
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

      app.getTodayReviewing(function(data){
      });

      app.getTodyReciting(function(data){
        that.isLogin = true;
        if (data == null) {
          //表示用户没有选择背诵注意,需要提醒去选择;或者今日不需要新增背诵了
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
    if (this.isLogin) {
      var data = app.globalData.todayReciteData;
      this.setData({
          todayData:data
      })
    }
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
      if(app.globalData.returnCode == 451) {
        wx.showModal({
          title: '提示',
          content: '请切换新主题',
          showCancel: false
        })
        return;
      }else if(app.globalData.returnCode == 452){
        $wuxToast.show({
            type: 'text',
            timer: 1500,
            text: '请先设置一个背诵主题'
        })
        return;
      }

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