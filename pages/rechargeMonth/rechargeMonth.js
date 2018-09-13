// pages/rechargeMonth/rechargeMonth.js
var app = getApp().globalData;
var apps = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xq_name: '',
    xq_city: '',
    xq_id: '',
    money: '0.00',
    recharge_id: 0,
    recharge_cid: null,
    recharge_list: [],
    num_moneylist: [],
    recharge_rule: [],
    mid: '',
    use_times: '',
    animationData: {},
    mask_show: true,
    show_pay: false,
    pay_state: '1',
    remain_day: '0',
    use_day: false,
    recharge_btn: true,//充值购买月卡按钮，
    pay_money: 0,//购买月卡选择的类型金额
    u_balance_money: 0,//账户余额
    cash_money: '',//选择的充值金额数值
    activity_id: '',//活动id
    is_new_reward: '',//是否是新人
    recharge_maxrule: '',//最高收费标准
    extra_title: '',//新人活动标题
    expiry_time: '',//活动期限
    give_is_no: '',//是否有充赠活动
    is_can_buy: true,//是否可以购买月卡
    payment_list: [
      {
        txt: '微信支付',
        img: '../../images/Select_round@2x.png',
        state: '1',
        pay_img: '../../images/weixin_icon.png'
      },
      {
        txt: '余额支付(余额0元)',
        img: '../../images/rounds@3x.png',
        state: '2',
        pay_img: '../../images/wallet.png'
      },
    ],
    phone_id: '',
    deviceid: '',
    s_state: '',
    is_no_state: '',
    card_money: '',
    new_title: '',//新人福利
    useful_days: ''
  },
  go_payment: function (e) {
    console.log(e)
    let formId = e.detail.formId;
    if (formId == "the formId is a mock one") {
    } else {
      apps.dealFormIds(formId);
      app.config.up_formid(formId)
    }
  },
  select_item: function (e) {//底部弹出框选择充值方式
    var that = this,
      list = that.data.payment_list,
      id = e.currentTarget.dataset.id, pay_state = '';

    for (let i = 0; i < list.length; i++) {
      if (id == list[i].state) {
        if (list[i].state == 1) {
          pay_state = 1;
          list[i].img = '../../images/Select_round@3x.png'
        } else if (list[i].state == 2) {
          if (Number(that.data.u_balance_money) < Number(that.data.card_money)) {
            wx.showToast({
              title: '余额不足',
              image: '../../images/cuo@2x.png'
            })
            that.setData({
              recharge_btn: true//按钮可点击
            })
            pay_state = 1;
            list[0].img = '../../images/Select_round@3x.png'
            list[i].img = '../../images/rounds@3x.png'
          } else {
            pay_state = 2;
            list[i].img = '../../images/Select_round@3x.png'
          }
        }
      } else {
        list[i].img = '../../images/rounds@3x.png'
      }
    }
    that.setData({
      payment_list: list,
      pay_state: pay_state
    })
  },
  recharge_month_btn: function () {//月卡购买按钮//上滑显示选项
    var that = this, no_use = false;
    if (that.data.is_can_buy==false){
        wx.showToast({
          title: '大于'+that.data.limit_days+'天不能购买月卡',
          icon:'none'
        })
    }else{
      if (Number(that.data.u_balance_money) < Number(that.data.card_money)) {
        that.setData({
          no_use: true
        })
      } else {
        that.setData({
          no_use: false
        })
      }
      that.setData({
        mask_show: false,
        show_pay: true,
      })
    }

  },
  mask: function () {//点击隐藏遮罩层及弹出框

    this.setData({
      mask_show: true,
      show_pay: false
    })
  },
  recharge_btn: function () {//月卡充值
    var that = this,go_state='';
    var phone_id = that.data.phone_id;
    if (that.data.phone_id == 1 && (that.data.s_state == undefined || that.data.s_state == 'undefined' || that.data.s_state == null)){
      go_state =1
    } else if ((that.data.phone_id == undefined || that.data.phone_id == 'undefined' || that.data.phone_id == null) && that.data.s_state == 5){
      go_state = 5
    } else if ((that.data.phone_id == undefined || that.data.phone_id == 'undefined' || that.data.phone_id == null) && that.data.s_state == 55){
      go_state = 55
    }
    console.log("月卡充值按钮", that.data.phone_id, that.data.s_state,go_state)
    that.setData({
      recharge_btn: false//按钮不可点击
    })
    app.qcloud.request({
      url: app.config.service.hostUrl + 'recharge/index',
      data: {
        mid: that.data.mid,
        cash_type: 1,
        use_payment: that.data.pay_state
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (response) {
        console.log(response);
        var data = response.data.data;
        that.mask();
        if (response.data.err == 1) {//微信支付
          wx.requestPayment({
            'timeStamp': data.timeStamp,
            'nonceStr': data.nonceStr,
            'package': data.package,
            'signType': 'MD5',
            'paySign': data.paySign,
            'success': function (res) {
              console.log("支付", res)
              wx.showToast({
                title: '充值成功！',
                image: '../../images/dui@2x.png',
                success: function () {
                  if (go_state == 1) {
                    setTimeout(function () {
                      wx.navigateBack({
                        delta: 1
                      })
                    }, 1000)
                  } else if (go_state == 5) {//扫码充值->跳转充电
                    setTimeout(function () {
                      wx.reLaunch({
                        url: '../electricize/electricize?state=5&deviceid=' + that.data.deviceid,
                      })
                    }, 1000)
                  } else if (go_state == 55) {//扫码充值->跳转充电
                    setTimeout(function () {
                      wx.reLaunch({
                        url: '../electricize/electricize?state=55&deviceid=' + that.data.deviceid,
                      })
                    }, 1000)
                  } else {
                    setTimeout(function () {
                      wx.reLaunch({
                        url: '../index/index',
                      })
                    }, 1000)
                  }

                }
              })
            },
            'fail': function (res) {
              console.log(res.errMsg)
              wx.showToast({
                title: '取消支付',
                image: '../../images/cuo@2x.png'
              })
              that.setData({
                recharge_btn: true//按钮可点击
              })
            }
          })
        } else if (response.data.err == 2) {
          console.log("余额支付成功", that.data.s_state, that.data.deviceid)
          wx.showToast({
            title: response.data.msg,
            image: '../../images/dui@2x.png',
            success: function () {
              if (go_state == 1) {
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 1000)
              } else if (go_state == 5) {//扫码充值->跳转充电
                setTimeout(function () {
                  wx.reLaunch({
                    url: '../electricize/electricize?state=5&deviceid=' + that.data.deviceid,
                  })
                }, 1000)
              } else if (go_state == 55) {//扫码充值->跳转充电
                setTimeout(function () {
                  wx.reLaunch({
                    url: '../electricize/electricize?state=55&deviceid=' + that.data.deviceid,
                  })
                }, 1000)
              } else {
                setTimeout(function () {
                  wx.reLaunch({
                    url: '../index/index',
                  })
                }, 1000)
              }

            }
          })
        } else if (response.data.err == 3) {
          wx.showToast({
            title: response.data.msg,
            image: '../../images/cuo@2x.png'
          })
          that.setData({
            recharge_btn: true//按钮可点击
          })
        }

      },
      fail: function (err) {
        console.log(err);
      }
    });
  },
  go_newuser: function () {//新人福利充值
    var that = this;
    console.log("新人活动", that.data.phone_id, that.data.s_state )
    wx.navigateTo({
      url: '../rechargeCash/rechargeCash?id=2&phone_id=1&deviceid=' + that.data.deviceid + '&state=' + that.data.s_state,
    })
    that.setData({
      mask_show: true,
      show_pay: false
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    console.log("月卡充值页面", options.phone_id,options.state, options.id, options.xqid,  options.deviceid, options.is_no_state)
    that.setData({
      state_id: options.id,//充值类型
      phone_id: options.phone_id,
      deviceid: options.deviceid,//设备id
      s_state: options.state,//扫码进入
      is_no_state: options.is_no_state,//是否带小区的充值
      xq_id: options.xqid
    })
    if (options.xqid) {
      that.setData({
        is_no_state: 2
      })
    }
    that.loadshow();
  },
  loadshow: function (options){
    var that = this;
    if (that.data.state_id == 1) {//月卡充值
      app.qcloud.request({
        url: app.config.service.hostUrl + 'xiaoqu/charging',
        data: {
          xqid: that.data.xq_id
        },
        method: 'POST',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (response) {
          console.log(response);
          var data = response.data.data;
          if (data.remain_day == 0) {
            that.setData({
              use_day: false
            })
          } else {
            that.setData({
              use_day: true
            })
          }
          if (data.is_can_buy == 'y') {//是否能购买月卡
            that.setData({
              is_can_buy: true
            })
          } else {
            that.setData({
              is_can_buy: false
            })
          }
          if (data.title != '') {//是否有新人福利
            that.setData({
              new_title: data.title,
              is_newuser: true
            })
          } else {
            that.setData({
              new_title: '',
              is_newuser: false
            })
          }
          that.setData({
            xq_name: data.xq_name,
            limit_days: data.limit_days,//大于多少天不能购买月卡
            card_money: data.recharge_list.card_money,
            mid: data.recharge_list.mid,
            use_times: data.use_times,//可用次数
            remain_day: data.remain_day,//剩余天数
            useful_days: data.recharge_list.useful_days,//月卡天数
            u_balance_money: data.u_balance_money,
            'payment_list[1].txt': '余额支付(余额' + data.u_balance_money + '元)'
          })
        },
        fail: function (err) {
          console.log(err);
          wx.showToast({
            title: err,
          })
        }
      });

    } else if (that.data.state_id == 3) {
      wx.reLaunch({
        url: '../index/index',
      })
    }
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
    this.loadshow();
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