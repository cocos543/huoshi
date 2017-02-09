//index.js
//获取应用实例
let chapter = require('./chapter');
var util = require('../../utils/util.js')
let app = getApp();
Page({
  data: {
    chapter, //章节数据
    activeBook : 1, //0:旧约, 1:新约
    activeChapter : null, //当前展开的章节
    sectionModel : [], //当前展开章节的小节模型
    
  },
  handleChangeBook : function(event){
    let activeBook = event.target.dataset.book;
    if(activeBook !== this.data.activeBook){
      this.setData({
        activeBook,
        activeChapter:null
      })
    }
  },
  handleActiveChapter : function(event){
    let activeChapter = event.target.dataset.chapter;

    if(activeChapter === this.data.activeChapter && activeChapter !== null){
      this.setData({
        activeChapter:null,
        sectionModel:[]
      });
    }else{
      this.setData({
        activeChapter,
        sectionModel : this.formatChapterArray(this.data.chapter[this.data.activeBook].items[activeChapter].chapter_number)
      });
    }
  },
  handleGoToSection : function(event){
    let data = this.data.chapter[this.data.activeBook].items[this.data.activeChapter];

    wx.navigateTo({
      url: '../section/section?section='+ event.target.dataset.section + '&name=' + data.full_name + '&volumeId=' + data.volume_id
    })
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

    this.setData({
        chapter : this.formatChapter(chapter),
    });
    
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
  }
})
