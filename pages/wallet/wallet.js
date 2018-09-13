// pages/wallet/wallet.js
var app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:'0.00',
    song:1,
    money_list:[],
    pages:0,
    pagenum:1,
    // count:10,
    Loading: false, //"上拉加载"的变量，默认false，隐藏  
    LoadingComplete: false  //“没有数据”的变量，默认false，隐藏  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

      app.qcloud.request({
        url: app.config.service.hostUrl + 'user/walletdetail',
        data: {
         page:1
        },
        method: 'POST',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (response) {
          console.log(response)
          var data = response.data.data;
          that.setData({
            money: data.u_balance_money,
            money_list: data.wallet_details,
            pages:data.pages,
            pagenum: data.current_page
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
    var that = this, pagenum = that.data.pagenum+1;
    console.log(pagenum,)
    if(pagenum>that.data.pages){
      that.setData({
        LoadingComplete:true
      }) 
      wx.showToast({
        title: '没有更多了',
        icon: 'loading',
        duration:600
      })
    }else{
      that.setData({
        Loading: true
      })
      wx.showLoading({
        title: '正在加载中',
        icon:'loading'
      })
      app.qcloud.request({
        url: app.config.service.hostUrl + 'user/walletdetail',
        data: {
          page: pagenum
        },
        method: 'POST',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (response) {
          var data = response.data.data;
          var lists = that.data.money_list.concat(data.wallet_details)
          console.log(that.data.money_list, data.wallet_details, lists)
          that.setData({
            money_list: lists,
            pagenum: data.current_page,
            Loading: false
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