//index.js
//获取应用实例
let chapter = require('./chapter');
let app = getApp();
Page({
  data: {
    chapter, //章节数据
    activeBook : 0, //0:新约, 1:旧约
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
        sectionModel : this.formatChapterArray(this.data.chapter[this.data.activeBook].items[activeChapter].number)
      });
    }
  },
  formatChapterArray : function(n){
    let arr = new Array(n);
    for(let i=0; i<n; i++){
      arr[i] = 1;
    }
    return arr;
  },
  formatChapterText : function(str){
    console.log(str)
    return 'txt'
    // return '<view>' + str.substring(0,1)+ '</view>';
  }
});
