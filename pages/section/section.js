//index.js
var util = require('../../utils/util.js')
let app = getApp();
Page({
  data: {
    isNew : '',
    volumeId : '',
    section : ''
    
  },
  
  onLoad : function(options){
    console.log(options)
    this.setData({
      isNew : options.isNew,
      volumeId : options.volumeId,
      section : options.section,

    })
    
  }
})
