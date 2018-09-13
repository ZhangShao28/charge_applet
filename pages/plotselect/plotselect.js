// pages/plotselect/plotselect.js
var app = getApp().globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    city_list: ['请选择城市'],
    index:0,
    xq_name:'选择小区',
    xqid:'',
    list_xqname:'',
    arrylist: [],
    inputShowed: false,
    inputVal: ""
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  go_index:function(e){
   
    var xq_id = e.currentTarget.dataset.id
    console.log(e,xq_id);
    wx.reLaunch({
      url: '../index/index?xqid='+xq_id,
    })
  },
  select_city: function (e) {
    // console.log('picker发送选择改变，携带值为', this.data.city_list[e.detail.value])
    var that = this;
    var value = that.data.city_list[e.detail.value];
    this.setData({
      index: e.detail.value
    })
    app.qcloud.request({
      url: app.config.service.hostUrl + 'xiaoqu/xqlist',
      data: {
        city: value
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (response) {
        console.log(response);
        var data = response.data.data;
        that.setData({
         arrylist: data.xq_list,
          xq_name: data.xq_name
        })
      },
      fail: function (err) {
        console.log(err);
      }
    });
  },
  searchinput:function(e){
    var value = e.detail.value, that = this;
    var city_name = that.data.city_list[that.data.index]
    app.qcloud.request({
      url: app.config.service.hostUrl + 'xiaoqu/xqlist',
      data: {
        search: value,       
        city: city_name
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (response) {
        console.log(response);
        var data = response.data.data;
        if (data.xq_list.length==0){
            wx.showToast({
              title: '该城市暂无',
              image:'../../images/cuo@2x.png'
            })
        }
        that.setData({
          arrylist: data.xq_list,
          xq_name: data.xq_name
        })
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
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    console.log(options.xqid)
    app.qcloud.request({
      url: app.config.service.hostUrl + 'xiaoqu/xqlist',
      data: {
        xqid: options.xqid,
        search:''
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (response) {
        wx.hideLoading();
        var data = response.data.data;
        console.log(response, data.city );
        if (data.xq_name == null || data.xq_name==''){
          var xq_name =''
          that.setData({
            arrylist: data.xq_list,
            xq_name: '选择充电桩',
            city_list: data.city,
            index: data.city_follow,
            xqid: options.xqid
          })
        }else{
          that.setData({
            arrylist: data.xq_list,
            xq_name:data.xq_name,
            city_list: data.city,
            index: data.city_follow,
            xqid: options.xqid
          })
        }
      },
      fail: function (err) {
        wx.hideLoading()
        wx.showModal({
          title: '',
          content: '请求超时，请检查网络是否正常！',
          showCancel: false,
          confirmText: '关闭'
        })
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