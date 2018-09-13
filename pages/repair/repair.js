// pages/repair/repair.js
var app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type_state:1,//1电动车充电故障、2计费故障、3硬件故障、4其他
    txt_input:'',
    our_phone:'',
    property_phone:'',
    is_no:'',
    list: [
      {
        id: '0',
        name: '电动车充电故障',
        open: false,
        type_state: null
      },
      {
        id: '1',
        name: '计费故障',
        open: false,
        type_state:null
      },
      {
        id: '2',
        name: '插座故障',
        open: false,
        type_state:null
      },
      {
        id: '3',
        name: '其他',
        open: false,
        type_state:null
      }
    ],
    charging:[
      {
        tit: '未成功充电，却进行扣费',
        flag: false,
        id:0,
        types:1
      },
      {
        tit: '重复扣费/扣次数',
        flag: false,
        id: 1,
        types: 1
      }
    ],
    electrocar: [
      {
        tit: '插入插座，没有电',
        flag: false,
        id: 0,
        types:0
      },
      {
        tit: '充电中途断电',
        flag: false,
        id: 1,
        types: 0
      },
      {
        tit: '不能结束充电',
        flag: false,
        id: 2,
        types: 0
      }
    ],
     hardware: [
      {
        tit: '编号不清晰',
        clas: "b1",
        flag: false,
        id: 0,
        types: 2
      },
      {
        tit: 'USB损坏',
        clas: "b2",
        flag: false,
        id: 1,
        types: 2
      },
      {
        tit: '插口损坏',
        clas: "b3",
        flag: false,
        id: 2,
        types: 2
      },
      {
        tit: '整台设备损坏',
        clas: "b4",
        flag: false,
        id: 3,
        types: 2
      },
      {
        tit: '指示灯故障',
        clas: "b5",
        flag: false,
        id: 4,
        types: 2
      },
      {
        tit: '二维码损坏',
        clas: "b6",
        flag: false,
        id: 5,
        types: 2
      },
    ]
  },
  kindToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.list;
    console.log(id)
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
        list[i].type_state =i
        console.log(i)
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  },
   go_our_kefu: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.our_phone,
    })
  },
   go_property_kefu:function(){
      wx.makePhoneCall({
        phoneNumber: this.data.property_phone,
     })
   },
   select_charging:function(e){//计费故障
     console.log(id)
     var id = e.currentTarget.dataset.id, list = this.data.charging;
     for (var i = 0, len = list.length; i < len; i++) {
       if (list[i].id == id) {
         if (list[i].flag) {
           list[i].flag = false
         } else {
           list[i].flag = true
         }
       } else {
         list[i].flag = false
       }
     }
     this.setData({
       charging: list
     });
   },
   select_electrocar: function (e) {//电动车故障
    //  console.log(e.currentTarget.dataset.id)
     var id = e.currentTarget.dataset.id, list = this.data.electrocar;
     console.log(id)
     for(var i =0,len = list.length;i<len;i++){

        if(list[i].id == id){
          if (list[i].flag){
            list[i].flag = false
          }else{
            list[i].flag = true
          }
        }else{
            list[i].flag = false
        }
     }
     this.setData({
       electrocar: list
     });
     
   },
   select_hardware: function (e) {//插座故障
     var id = e.currentTarget.dataset.id, list = this.data.hardware;
     for (var i = 0, len = list.length; i < len; i++) {
       console.log(id, list[i].id)
       if (list[i].id == id) {
         if (list[i].flag) {
           list[i].flag = false
         } else {
           list[i].flag = true
         }
       }
     }
     this.setData({
       hardware: list
     });
   },
   change_input:function(e){
     console.log(e.detail.value)
     this.setData({
       txt_input: e.detail.value
     })
   },
   submit_btn:function(){
     var that = this;
     var list = that.data.list, 
       hardware = that.data.hardware,
       electrocar = that.data.electrocar,
       charging = that.data.charging;
      var  arry = [];
      var types='';
      var flag = false;
      for (var i = 0, len = list.length; i < len; i++) {
        if (list[i].flag){
          arry += list[i].tit + '.'
        }
      }
      for (var i = 0, len = hardware.length; i < len; i++) {
        if (hardware[i].flag) {
          arry +=  hardware[i].tit + '.'
          flag = true;
        }
      }
      if(flag){
        types += 3 + ','
      }
      for (var i = 0, len = electrocar.length; i < len; i++) {
        if (electrocar[i].flag) {
          arry += electrocar[i].tit +'.'
          types += 1 + ','
        }
      }
      for (var i = 0, len = charging.length; i < len; i++) {
        if (charging[i].flag) {
          arry += charging[i].tit + '.'
          types += 2 + ','
        }
      }
      arry = arry + that.data.txt_input;
      console.log(arry, that.data.xqid, that.data.device_id, types)
  
    app.qcloud.request({
      url: app.config.service.hostUrl + 'helper/baoxiu',
      data: {
        device_id: that.data.device_id,
        device_no: that.data.device_no,
        content:arry,
        types: types
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (response) {
        wx.showToast({
          title: '报修成功！',
          image: '../../images/dui@2x.png',
          duration:1000
        })
       setTimeout(function(){
         wx.navigateBack({
           delta: 1,
         })
       },2000)
      
      },
      fail: function (err) {
        console.log(err);
      }
    });
   },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.xqid, options.device_id, options.device_no)
    var that =this;
    that.setData({
      xqid:options.xqid,
      device_id: options.device_id,
      device_no: options.device_no
    })
    app.qcloud.request({
      url: app.config.service.hostUrl + 'helper/repair',
      data: {
        xqid: options.xqid
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (response) {
        console.log(response);
        var data = response.data.data;
        if (data.our_phone==null){
          that.setData({
            is_no:0
          })
        }else{
          that.setData({
            is_no: 1
          })
        }
        that.setData({
          our_phone: data.our_phone,
          property_phone: data.property_phone
        })
      },
      fail: function (err) {
        console.log(err);
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})