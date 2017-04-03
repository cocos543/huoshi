// pages/recitation/review.js
var app = getApp();
Page({
  data:{
    titleLabel:null,
    topicData:null,
    reviewData:null,
    handleContent:"加载中...",
    reviewIndex:0,
    sourceLabel:"",
  },
  onLoad:function(options){
    this.updateProcessBar();

    // 页面初始化 options为页面跳转所带来的参数
    var title, tData, rData, content = '加载中...';
    var that = this;
    if (options.isNew == '1') {
      title = '金句初记'
      tData = app.globalData.todayReciteData
      content = handleData(tData.content);
      this.setData({
        topicData:tData,
        handleContent:content,
        sourceLabel: tData.book_name + " " + tData.chapter_no + ":" + tData.verse_no,
      });

    }else {
      title = '金句复习'
      if (options.load == '1') {
        app.getTodayReviewing(function(data){
          if (data == null) {
            //没有背诵内容了.进入结束界面.
            wx.redirectTo({
                url: '/pages/recitation/done'
            })
          }else {
            rData = data[app.globalData.reviewIndex];
            if (!rData) {
              wx.redirectTo({
                url: '/pages/recitation/done'
              })
              return;
            }
            content = handleData(rData.content);
            var sourceLabel = rData.book_name + " " + rData.chapter_no + ":" + rData.verse_no;
            that.setData({
              handleContent:content,
              reviewData:rData,
              sourceLabel:sourceLabel,
            });
          }
        })
      }else {
        rData = app.globalData.todayReviewData[app.globalData.reviewIndex];
        if (!rData) {
          wx.redirectTo({
            url: '/pages/recitation/done'
          })
          return;
        }
        var sourceLabel = rData.book_name + " " + rData.chapter_no + ":" + rData.verse_no;
        content = handleData(rData.content);
        this.setData({
          handleContent:content,
          reviewData:rData,
          sourceLabel:sourceLabel,
        });
      }
    }

    this.setData({
      titleLabel:title,
    });
  },
  onReady:function(){
    // 页面渲染完成
    this.updateProcessBar();
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

  updateProcessBar:function(){
    var processBar = {};
    processBar.totalStep = 2 + app.globalData.todayReviewData.length;
    processBar.step = app.globalData.currentReciteStat.count + app.globalData.reviewIndex;
    processBar.precent = Math.floor(processBar.step / processBar.totalStep * 100);

    this.setData({
      processBar:processBar
    });
  },

  clickBack:function(){
    if (this.data.topicData) {
      wx.redirectTo({
        url: '/pages/recitation/recite'
      })
    }else if(this.data.reviewData) {
      var rData = this.data.reviewData;
      this.setData({
        handleContent:rData.content
      });
    }
  },

  clickDone:function(){
    var that = this;
    if (this.data.topicData) {
      wx.showToast({
        title: '上报中',
        icon: 'loading',
        duration: 10000,
      });
      app.uploadReciteData(function(todayReciteData) {
        if (todayReciteData == null) {
          //No more mission
          app.getTodayReviewing(function(data){
            wx.hideToast();
            if (data == null) {
              //No more data to review.
              wx.redirectTo({
                url: '/pages/recitation/done'
              })
            }else {
              //Need to reviewing content. A but, can't navigate...
              // wx.redirectTo({
              //   url: '/pages/recitation/review?isNew=0&load=0'
              // });
              var rData = data[app.globalData.reviewIndex];
              if (!rData) {
                wx.redirectTo({
                  url: '/pages/recitation/done'
                })
                return;
              }
              that.setData({
                topicData:null,
                titleLabel:'金句复习',
                handleContent: handleData(rData.content),
                reviewData:rData,
              });

              that.updateProcessBar();
            }
          });
        }else {
          wx.redirectTo({
            url: '/pages/recitation/recite'
          });
          wx.hideToast();
          console.log(todayReciteData);
        }
        
      }, this.data.topicData);
    }else if(this.data.reviewData) {
      //一次复习完成了,继续检查是否有其他需要复习的
      app.globalData.reviewIndex++;
      app.saveGlobalData();
      if (app.globalData.reviewIndex < app.globalData.todayReviewData.length) {
        wx.redirectTo({
          url: '/pages/recitation/review?isNew=0&load=0',
        });
      } else {
        wx.redirectTo({
          url: '/pages/recitation/done'
        })
      }
    }
    
  },
})

function handleData(content) {
  var newStr = '';
  var count = 0;

  for(var i = 0; i < content.length; i++){
    var char = content[i];
    if (isChineseChar(char)) {
      if (Math.random() < 0.7) {
        newStr += '*';
      }else {
        newStr += content[i];
      }
    }else {
      newStr += content[i];
    }
  }
  return newStr;
}

function isChineseChar(str){   
   var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
   return reg.test(str);
}









