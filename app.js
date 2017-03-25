//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var data = wx.getStorageSync('globalData') || null
    if (data) {
      this.globalData = data;

      //初始化一些固定的数据
      this.globalData.topicList = [{'name':'相信上帝','num':23, 'id':1},{'name':'神的安慰','num':26, 'id':2},{'name':'永生','num':28, 'id':3},{'name':'信心','num':45, 'id':4},{'name':'坦然无惧','num':27, 'id':5},{'name':'罗马书(全书)','num':433, 'id':18}];
    }
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

  getTodyReciting:function(cb, topidID){
    var that = this;
    var token = this.globalData.userKey;
    var topicID = topidID ? topidID : this.globalData.topicID;
    wx.request({
                url: 'https://www.huoshi.im/bible/frontend/web/index.php/v1/wechat/new/content',
                data: {
                  token: token,
                  topic_id:topicID
                },
                success: function(res) {
                  if (res.data.code == 200) {
                    that.globalData.todayReciteData = res.data;
                    wx.setStorageSync('globalData', that.globalData);
                    console.log(res.data);
                  }else if(res.data.code == 452) {
                    //从未选择背诵内容
                    that.globalData.todayReciteData = null;
                  }
                  typeof cb == "function" && cb(that.globalData.todayReciteData)
                }
              })
      //
  },

  getProcessList:function(cb){
    var that = this;
    var token = this.globalData.userKey;
    wx.request({
                url: 'https://www.huoshi.im/bible/frontend/web/index.php/v1/wechat/recite/progress',
                data: {
                  token: token,
                },
                success: function(res) {
                  if (res.data.code == 200) {
                    that.globalData.processList = res.data;
                    wx.setStorageSync('globalData', that.globalData);
                  }
                  typeof cb == "function" && cb(that.globalData.processList);
                }
              })
      //
  },

  globalData:{
    userInfo:null,
    userKey :null,
    topicID:null,
    todayReciteData:null,
    processList: null,
    topicList:null,
  },
  
})