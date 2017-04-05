//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var data = wx.getStorageSync('globalData') || null
    if (data) {
      this.globalData = data; 
    }
    //初始化一些固定的数据
    this.globalData.topicList = [{'name':'相信上帝','num':23, 'id':1},{'name':'神的安慰','num':26, 'id':2},{'name':'永生','num':28, 'id':3},{'name':'信心','num':45, 'id':4},{'name':'坦然无惧','num':27, 'id':5},{'name':'罗马书(全书)','num':433, 'id':18}];
  },

  getUserInfo:function(cb){
    var that = this
    //调用登录接口
    wx.login({
      success: function (res) {
        if(res.code) {
          if (res.code) {
            //发起网络请求
            wx.request({
              url: 'https://www.huoshi.im/bible/frontend/web/index.php/v1/wechat/login',
              data: {
                code: res.code
              },
              success: function(res) {
                that.globalData.userKey = res.data.data.token;
                wx.setStorageSync('globalData', that.globalData);
                console.log(res.data.data.token);

                wx.getUserInfo({
                  success: function (res) {
                    that.globalData.userInfo = res.userInfo
                    typeof cb == "function" && cb(that.globalData.userInfo)
                  }
                })

              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      }
    })
  },

  getTodyReciting:function(cb, topicID){
    var that = this;
    var token = this.globalData.userKey;
    var topicID = topicID ? topicID : this.globalData.todayReciteData.topic_id;
    if (!this.checkNeedReciting()) {
      //没有新增背诵了
      typeof cb == "function" && cb(this.globalData.todayReciteData)
      return;
    }
    wx.request({
      url: 'https://www.huoshi.im/bible/frontend/web/index.php/v1/wechat/new/content',
      data: {
        token: token,
        topic_id:topicID,
      },
      success: function(res) {
        if (res.data.code == 200) {
          that.globalData.todayReciteData = res.data.data;
          wx.setStorageSync('globalData', that.globalData);
          console.log(res.data);
          that.globalData.todayReciteReturnCode = 200;
        }else if(res.data.code == 452) {
          //从未选择背诵内容
          that.globalData.todayReciteData = null;
          that.globalData.todayReciteReturnCode = 452;
        }else if(res.data.code == 451) {
          //背诵完成了,重新选择.
          that.globalData.todayReciteReturnCode = 451;
        }
        typeof cb == "function" && cb(that.globalData.todayReciteData)
      }
    })
  },

  getTodayReviewing:function(cb) {
    var that = this;
    var token = this.globalData.userKey;
    wx.request({
      url: 'https://www.huoshi.im/bible/frontend/web/index.php/v1/wechat/today/review',
      data: {
        token: token
      },
      success: function(res) {
        if (res.data.code == 200) {
          that.globalData.todayReviewData = res.data.data;
          that.saveGlobalData();
          console.log(res.data.data);
        }else {
          //暂无背诵内容
          that.globalData.todayReviewData = null;
        }
        
        typeof cb == "function" && cb(that.globalData.todayReviewData)
      }
    })
  },

  setIngroneReciting:function(cb, topicData) {
    var that = this;
    var token = this.globalData.userKey;
    wx.request({
      url: 'https://www.huoshi.im/bible/frontend/web/index.php/v1/wechat/ignore/content',
      data: {
        token: token,
        topic_id: topicData.topic_id,
        content_id: topicData.content_id,
      },
      success: function(res) {
        if (res.data.code == 200) {
          //忽略成功,重新请求新内容
          typeof cb == "function" && cb(200);
        }else {
          typeof cb == "function" && cb(res.data.code);
          console.log(res.data);
        }
      }
    })
  },

  uploadReciteData:function(cb, topicData){
    var that = this;
    var token = this.globalData.userKey;
    wx.request({
      url: 'https://www.huoshi.im/bible/frontend/web/index.php/v1/wechat/complete/recite',
      data: {
        token: token,
        topic_id: topicData.topic_id,
        content_id: topicData.content_id,
        topic_name: topicData.topic_name,
      },
      success: function(res) {
        if (res.data.code == 200) {
          //上报成功了,继续获取新的背诵内容
          var todayStr = new Date().Format("yyyy-MM-dd");
          that.globalData.currentReciteStat.lastTime = todayStr;
          that.globalData.currentReciteStat.count += 1;
          wx.setStorageSync('globalData', that.globalData);
          if (that.checkNeedReciting()) {
            that.getTodyReciting(cb)
          }else {
            typeof cb == "function" && cb(null);
          }
        }
      },
      fail:function(res) {

      }
    })
  },

  getReciteProcess:function(cb){
    var that = this;
    var token = this.globalData.userKey;
    wx.request({
      url: 'https://www.huoshi.im/bible/frontend/web/index.php/v1/wechat/recite/progress',
      data: {
        token: token,
      },

      success: function(res) {
        if (res.data.code == 200) {
          that.globalData.reciteProcessData = res.data.data;
          that.saveGlobalData();
        }
        typeof cb == "function" && cb(that.globalData.reciteProcessData);
      },
      fail:function(res) {

      }
    })
  },

  checkNeedReciting:function(){
    var todayStr = new Date().Format("yyyy-MM-dd");
    if (this.globalData.currentReciteStat && this.globalData.currentReciteStat.lastTime == todayStr) {
      if (this.globalData.currentReciteStat.count >= 2) {
        //今日不需要再背诵了
        return false;
      }else {
        return true;
      }
    }else {
      //新的一天,重置背诵统计数据
      this.resetCurrentRecitingStat();
      return true;
    }
  },

  checkNeedReviewing:function(){
    if (this.globalData.todayReviewData) {
      return this.globalData.reviewIndex + 1 >= this.globalData.todayReviewData.length;
    }
    return false;
  },

  resetCurrentRecitingStat:function(){
    this.globalData.currentReciteStat.count = 0;
    this.globalData.reviewIndex = 0;
    this.globalData.currentReciteStat.todayReciteState = false;
    this.globalData.currentReciteStat.contentTotalLength = 0;
    this.globalData.currentReciteStat.statData = null;
    this.saveGlobalData();
  },

  saveGlobalData:function(){
    wx.setStorageSync('globalData', this.globalData);
  },

  globalData:{
    userInfo:null,
    userKey :null,
    //用户接口使用
    topicID:null,

    //统计背诵情况
    currentReciteStat:{lastTime:'',count:0, contentTotalLength:0, startTime:0,endTime:0, todayReciteState:false, statData:null},
    //背诵进度
    reciteProcessData:null,
    //今日背诵
    todayReciteData:null,
    //今日背诵接口返回码
    todayReciteReturnCode:0,
    //今日复习列表
    todayReviewData:null,
    //所有可背诵主题列表
    topicList:null,
    //复习索引
    reviewIndex:0
  },
  
})


// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}