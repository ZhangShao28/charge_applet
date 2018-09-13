// pages/myinfo/myinfo.js
var app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    tx_img:'../../images/myinfo/touxiang@3x.png',
    money:'0.00',
    is_charging:'',
    server_phone:'',
    phone_switch:'',
    switchChecked:true,
    is_new_reward:'',//是否新人福利
    active_title:''//活动标题
  },
  go_recharge:function(e){
    console.log(e.currentTarget.dataset.id)
    if (e.currentTarget.dataset.id==1){//月卡续费
      wx.navigateTo({
        url: '../rechargeMonth/rechargeMonth?id=1&phone_id=1' + '&xqid=' + e.currentTarget.dataset.xqid,
      })

    } else if (e.currentTarget.dataset.id==2){//现金充值不带小区id
      wx.navigateTo({
        url: '../rechargeCash/rechargeCash?id=2&phone_id=1',
      })
    }
    
  },
  go_myrechargelog:function(){
    wx.navigateTo({
      url: '../myrechargelog/myrechargelog',
    })
  
  },
  go_wallet_detail:function(){
    wx.navigateTo({
      url: '../wallet/wallet',
    })
  },
  go_server_phone:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.server_phone,
    })
  },
  switchChange: function (e) {
    var that = this, switch_id='';
    var pid = e.currentTarget.dataset.pid, sid = e.currentTarget.dataset.sid
    if (e.detail.value == true) {
      switch_id =1
      wx.showToast({
        title: '您已开启夜间推送',
      })
    } else {
      switch_id = 2
      wx.showToast({
        title: '您已关闭夜间推送',
      })

    }
    app.qcloud.request({
      url: app.config.service.hostUrl + 'user/msg',
      data: {
        switch: switch_id
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (response) {
        console.log(response);
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
    app.qcloud.request({
      url: app.config.service.hostUrl+'user/index',
      success: function (response) {
        wx.hideLoading()
        console.log(response);
        var data = response.data.data;
        var phone = data.u_mobilephone.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2");
        // var img = app.userInfo.avatarUrl;
        if (data.is_charging=='y'){
          that.setData({
            is_charging: '充电中'
          })
        }else{
          that.setData({
            is_charging: ''
          })
        }
        if (data.push_switch==1){
          that.setData({
            switchChecked:true
          })
        } else if (data.push_switch == 2){
          that.setData({
            switchChecked: false
          })
        }
        that.setData({
          money: data.u_balance_money,
          xq_list: data.month_card,
          phone: phone,
          // tx_img: img,
          server_phone: data.server_phone,
          phone_switch: data.phone_switch,
          is_new_reward: data.is_new_reward,
          push_switch: data.push_switch,
          active_title: data.title
        })
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
      this.onLoad()
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