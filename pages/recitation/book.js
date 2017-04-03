// pages/recitation/book.js
var app = getApp();

Page({
  data:{
    topicList: null,
    topicID:0,
    finishList:null,
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var topicID = app.globalData.todayReciteData ? app.globalData.todayReciteData.topic_id : -1
    var finishList = [], that = this;
    this.setData({
      topicList:app.globalData.topicList,
      topicID:topicID,
    });

    app.getReciteProcess(function(data){
      for(var i = 0; i < data.length; i++){
        var item = data[i];
        if (item.percent == "100%") {
          finishList.push(item);
        }
      }

      var topicList = app.globalData.topicList;
      var list = [];

      for(var i = 0; i < topicList.length; i++){
        var hit = false;
        for(var j = 0; j < finishList.length; j++){
          if (topicList[i].id == finishList[j].topic_id) {
            hit = true;
          }
        }
        if (!hit) {
          list.push(topicList[i]);
        }
      }


      that.setData({
        finishList:finishList,
        topicList:list,
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

  selectTopic:function(event){
    console.log(event);
    var that = this;
    var topicID = event.target.dataset.tid;
    wx.showModal({
      title: '提示',
      content: '切换新主题会清空当前背诵内容',
      cancelText:'不切换了',
      confirmText:'确定切换',
      confirmColor:'#000000',
      success: function(res) {
        if (res.confirm) {
          wx.showToast({
            title: '请稍后',
            icon: 'loading',
            mask: true,
            duration: 10000,
          });

          // 清空统计数据
          app.resetCurrentRecitingStat();
          //带上id请求
          app.getTodyReciting(function(data){
            if (data == null) {
              //表示用户没有选择背诵注意,需要提醒去选择
            }else {
              that.setData({
                topicID:data.topic_id,
              });
            }
            console.log(data);
            wx.hideToast();
          }, topicID);

        }
      }
    })
  },
})