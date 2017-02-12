//index.js
//获取应用实例
let chapter = require('./chapter');
var util = require('../../utils/util.js')
let app = getApp();
Page({
  data: {
    chapter, //章节数据
    chapterTop : [],
    chapterBottom : [],
    activeBook : 1, //0:旧约, 1:新约
    activeChapter : null, //当前展开的章节
    sectionModel : [], //当前展开章节的小节模型
    notice : ''
    
  },
  handleChangeBook : function(event){
    let activeBook = event.target.dataset.book;
    if(activeBook !== this.data.activeBook){
      this.setData({
        activeBook,
        activeChapter:null,
        chapterTop : this.data.chapter[activeBook].items,
        chapterBottom : []
      })
    }
  },
  handleActiveChapter : function(event){
    let activeChapter = event.target.dataset.chapter;
    let chapter = this.data.chapter[this.data.activeBook].items;
    if(activeChapter === this.data.activeChapter && activeChapter !== null){
      this.setData({
        activeChapter:null,
        sectionModel:[],
        chapterTop : chapter,
        chapterBottom : []
      });
    }else{
      let divIndex = Math.ceil((activeChapter + 1) / 3)*3;
      this.setData({
        activeChapter,
        sectionModel : this.formatChapterArray(chapter[activeChapter].chapter_number),
        chapterTop : chapter.slice(0,divIndex),
        chapterBottom : chapter.slice(divIndex)
      });
    }
  },
  handleGoToSection : function(event){
    let data = this.data.chapter[this.data.activeBook].items[this.data.activeChapter];

    wx.navigateTo({
      url: '../section/section?section='+ event.target.dataset.section + '&name=' + data.full_name + '&volumeId=' + data.volume_id + '&total=' + data.chapter_number
    });
  },
  formatChapterArray : function(n){
    let arr = new Array(n);
    for(let i=0; i<n; i++){
      arr[i] = 1;
    }
    return arr;
  },
  formatChapter : function(data){
    let res = [
      {
          "name":"旧约",
          "items":[]
      },
      {
          "name":"新约",
          "items":[]
      }
    ];

    for(let  i=0; i<data.length; i++){
      let item = data[i];
      item.name1 = item.full_name.substr(0,1);
      item.name2 = item.full_name.substr(1);
      if(item.is_new){
        res[1].items.push(item);
      }else{
        res[0].items.push(item);
      }
    }

    return res
  },
  onLoad : function(){
    let data = this.formatChapter(chapter);
    this.setData({
        chapter : data,
        chapterTop : data[this.data.activeBook].items
    });

    // 获取公告
    wx.request({
        url:"https://www.huoshi.im/bible/frontend/web/index.php/v1/wechat/notice",
        success: (res)=>{
          
          if(res.data.code === 200){
            this.setData({
                notice : res.data.data.notice,
            });
          }
          
        },
        fail:function(err){
            console.log(err)
        }

    })
    
    // wx.request({
    //     url:"https://www.huoshi.im/bible/frontend/web/index.php/v1/wechat/volume",
    //     success: (res)=>{
    //       this.setData({
    //           chapter : this.formatChapter(res.data.data),
    //       });
    //     },
    //     fail:function(err){
    //         console.log(err)
    //     }
    // })
  },
  onShareAppMessage : function(){
    return{
      title : '活石微信小程序',
      path : '/pages/index/index'
    }
  }
})
