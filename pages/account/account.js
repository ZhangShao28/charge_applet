// pages/account/account.js
var app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      num:'',
      btn_txt:'完成',
      end_tit:'',
      end_tits:'',
      state:'',   //1为月卡结算，2为现金结算
  },
  go_recharge:function(e){
    wx.reLaunch({
      url: '../index/index',
    })
      
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.qcloud.request({
      url: app.config.service.hostUrl + 'charging/finished',
      data: {
        order_no: options.order_no
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (response) {
    
        var data = response.data.data
        console.log(response, data.remain_day, data.u_balance_money,data.pay_money)
        if (data.state==1){//月卡充电
          that.setData({
            end_tit: '天',
            end_tits: '剩余天数',
            state:data.state,
            hour: data.hour,
            minute: data.minute,
            second: data.second,
            pay_money: data.remain_day,
            xqid:data.xqid
          })
        } else if (data.state == 2){// 次数充电
          that.setData({
            end_tit: '元',
            end_tits: '本次支付',
            state: data.state,
            hour: data.hour,
            minute: data.minute,
            second: data.second,
            num: data.u_balance_money,
            pay_money: data.pay_money,
            xqid: data.xqid
          })
        } else if (data.state == 3) {// 免费充电
          that.setData({
            end_tit: '元',
            end_tits: '本次支付',
            state: data.state,
            hour: data.hour,
            minute: data.minute,
            second: data.second,
            num: data.u_balance_money,
            pay_money: data.pay_money,
            xqid: data.xqid
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