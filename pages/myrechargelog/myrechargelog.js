// pages/wallet/wallet.js
var app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hour: '0',
    minute: '0',
    is_no: 'no',//没有记录
    rechargelog: [],
    order_no: '',
    pages: 0,
    pagenum: 1,
    Loading: false, //"上拉加载"的变量，默认false，隐藏  
    LoadingComplete: false,  //“没有数据”的变量，默认false，隐藏  
  },
  go_rechargedetail: function (e) {
    wx.navigateTo({
      url: '../electricize/electricize?order_no=' + e.currentTarget.dataset.orderno + '&state=10',
    })
  },
  kindToggle: function (e) {
    var k_id = e.currentTarget.id,
     list = this.data.rechargelog;
    for (var i = 0, len = list.length; i < len; i++) {
      if (list[i].k_id == k_id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    // console.log(charge_id)
    this.setData({
      rechargelog: list
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.qcloud.request({
      url: app.config.service.hostUrl + 'user/chargelog',
      success: function (response) {
        console.log(response, response.data.data.charge_log);
        var data = response.data.data
        if (data.charge_log.length == 0) {
          that.setData({
            is_no: 'no',
            hour: data.hour,
            minute: data.minute,
            rechargelog: data.charge_log,
            pagenum: data.current_page,
            pages: data.pages,
            order_no: data.order_no
          })
        } else {
          that.setData({
            is_no: 'yes',
            hour: data.hour,
            minute: data.minute,
            rechargelog: data.charge_log,
            pagenum: data.current_page,
            pages: data.pages
          })
        }

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
    this.onLoad();
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
    this.onLoad()
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
    var that = this, pagenum = that.data.pagenum + 1;
    console.log("页数", that.data.pagenum, pagenum, )
    if (pagenum > that.data.pages) {
      that.setData({
        LoadingComplete: true
      })
      wx.showToast({
        title: '没有更多了',
        icon: 'loading',
        duration: 600
      })
    } else {
      that.setData({
        Loading: true
      })
      wx.showLoading({
        title: '正在加载中',
        icon: 'loading'
      })
      app.qcloud.request({
        url: app.config.service.hostUrl + 'user/chargelog',
        data: {
          page: pagenum
        },
        method: 'POST',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (response) {
          var data = response.data.data;
          var list = that.data.rechargelog.concat(data.charge_log);
          // console.log(list)
          that.setData({
            pagenum: data.current_page,
            Loading: false,
            is_no: 'yes',
            hour: data.hour,
            minute: data.minute,
            rechargelog: list
          })
          wx.hideLoading()
        },
        fail: function (err) {
          console.log(err);
        }
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})