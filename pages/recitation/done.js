// pages/recitation/done.js
var app = getApp();

Page({
  data:{
    userInfo:null,
    statData:null,
    desc:null,
    reciteData:null,
  },

  onShareAppMessage: function () {
    var day = app.globalData.todayReciteData.recited_days;
    var title = "第"+day+"天|智能背圣经";
    return {
      title: title,
      path: '/pages/recitation/recitation',
      success: function(res) {
        // 分享成功
      },
      fail: function(res) {
        // 分享失败
      }
    }
  },

  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var info = app.globalData.userInfo;
    var that = this;

    var day = app.globalData.todayReciteData.recited_days;
    var desc = ["一颗赛艇！我已经累计" + day + "天和圣经金句谈笑风生！",
                "我已经累计背圣经" + day + "天！很惭愧，就做了一点微小的学习，继续努力。","我已经累计背圣经" + day + "天！哈利路亚赞美神，再接再厉用圣经金句装备自己。"];
    this.setData({
      userInfo:info,
      desc:desc[Math.floor(Math.random() * desc.length)],
    });

    if (!app.globalData.currentReciteStat.todayReciteState) {
      app.globalData.currentReciteStat.todayReciteState = true;
      app.globalData.currentReciteStat.endTime = new Date().getTime() / 1000;
      app.saveGlobalData();
      wx.showToast({
        title: '请稍后',
        icon: 'loading',
        mask: true,
        duration: 10000,
      });

      
      var statData = {
        minute:Math.ceil((app.globalData.currentReciteStat.endTime - app.globalData.currentReciteStat.startTime) / 60),
        totalLength:app.globalData.currentReciteStat.contentTotalLength,
        item:{percent:'--', recited_number:'--'},
      };

      this.setData({
        reciteData:app.globalData.todayReciteData,
        statData:statData,
      });

      app.getReciteProcess(function(data){
        var tid = app.globalData.todayReciteData.topic_id, item;
        var totalRecitedNumber = 0;
        for(var i = 0; i< data.length; i++){
          var it = data[i];
          totalRecitedNumber+= it.recited_number;
          if (it.topic_id == tid) {
            item = it;
            break;
          }
        }
        statData.item = item;
        statData.totalRecitedNumber = totalRecitedNumber;
        statData.todayRecitedNumber = 2 + app.globalData.todayReviewData.length;
        app.globalData.currentReciteStat.statData = statData;
        app.globalData.todayReciteData.percent = item.percent;
        app.saveGlobalData();

        that.setData({
          statData:statData,
        });

        wx.hideToast();
      });
    }else {
      this.setData({
          reciteData:app.globalData.todayReciteData,
          statData:app.globalData.currentReciteStat.statData,
      });
    }
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
  }
})