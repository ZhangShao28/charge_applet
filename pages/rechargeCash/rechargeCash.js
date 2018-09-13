// pages/recharge/recharge.js
var app = getApp().globalData;
var apps = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      xq_name:'',
      xq_city:'',
      xq_id:'',
      money:'0.00',
      recharge_src:'../../images/recharge/Recharge-and-start-charging@2x.png',
      recharge_id:0,
      recharge_cid:null,
      // num_color:'#ffbe00',
      select_item_background: 'background:url("https://img.ixmcd.com/wechat/xuanz@2x.png");background-size:100% 100%;background-repeat:no-repeat;background-position:center;',
      recharge_list:[],
      num_moneylist:[],
      recharge_rule:[],
      mid:'',
      use_times:'',
      animationData: {},
      mask_show:true,
      show_pay: false,
      pay_state:'1',
      remain_day:'0',
      use_day:false,
      recharge_btn:true,//充值购买月卡按钮，
      pay_money:0,//购买月卡选择的类型金额
      u_balance_money:0,//账户余额
      cash_money:'',//选择的充值金额数值
      activity_id:'',//活动id
      is_new_reward: '',//是否是新人
      recharge_maxrule:'',//最高收费标准
      extra_title: '',//新人活动标题
      expiry_time: '',//活动期限
      give_is_no:'',//是否有充赠活动
      is_can_buy:true,//是否可以购买月卡
      phone_id: '',
      deviceid: '',
      s_state: '',
      is_no_xqid: '',//是否带小区id的现金充值
      card_money: '',
      new_title:'',//新人福利
      useful_days:''
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
  radioChange:function(e){
    this.setData({
      mid: e.detail.value,
      
    })
    console.log(e)
  },
  go_recharge:function(){
    wx.navigateTo({
      url: '../chargeRule/chargeRule',
    })
  },
  select_recharge:function(e){
    var that = this;
    // console.log(e.currentTarget.dataset.id, e.currentTarget.dataset.pay_money, e.currentTarget.dataset.cid)
 
      that.setData({
        recharge_id: e.currentTarget.dataset.id,
        recharge_cid: e.currentTarget.dataset.cid,
        cash_money: e.currentTarget.dataset.pay_money
      })
  },
  recharge_cash_btn:function(){//现金充值
    var that = this, go_state = '';
    var phone_id = that.data.phone_id;
    if (that.data.phone_id == 1 && (that.data.s_state == undefined || that.data.s_state == 'undefined' || that.data.s_state==null)) {
      go_state = 1
    } else if ((that.data.phone_id == undefined || that.data.phone_id == 'undefined' || that.data.phone_id == null) && that.data.s_state == 5) {
      go_state = 5
    } else if ((that.data.phone_id == undefined || that.data.phone_id == 'undefined' || that.data.phone_id == null) && that.data.s_state == 55) {
      go_state = 55
    } else if (that.data.phone_id == 1 && (that.data.s_state == 55 || that.data.s_state == 5)){
      go_state = 1
    }
    console.log('现金充值按钮', that.data.phone_id, that.data.s_state, go_state)
    if (that.data.recharge_cid == null) {
      wx.showToast({
        title: '请选择购买项目',
        image: '../../images/cuo@2x.png'
      })
    } else {
      that.setData({
        recharge_btn: false//按钮不可点击
      })
    app.qcloud.request({
      url: app.config.service.hostUrl + 'recharge/index',
      data: {
        activity_id: that.data.activity_id,
        money: that.data.cash_money,
        cash_type: 2
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (response) {
        console.log(response);
        var data = response.data.data;
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
                     delta:1
                   })
                  }, 2000)
                } else if (go_state == 5) {//外部扫码充值->跳转充电
                  setTimeout(function () {
                    wx.reLaunch({
                      url: '../electricize/electricize?state=5&deviceid=' + that.data.deviceid,
                    })
                  }, 1000)
                } else if (go_state == 55) {//内部扫码充值->跳转充电 
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
      },
      fail: function (err) {
        console.log(err);
      }
    });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log("现金充值页面", options.phone_id, options.state, options.id, options.xqid, options.deviceid )
    var state_id = options.id
    that.setData({
      state_id: state_id,//充值类型
      phone_id: options.phone_id,
      deviceid: options.deviceid,//设备id
      s_state: options.state,//扫码进入
      // is_no_xqid: options.xqid,//是否带小区的充值
      xq_id: options.xqid
    })
    if (options.xqid == undefined || options.xqid == '' || options.xqid == null){
      that.setData({
        is_no_xqid:1
      })
    }else{
      that.setData({
        is_no_xqid:2
      })
    }
    if (that.data.state_id == 2){//现金充值
        app.qcloud.request({
          url: app.config.service.hostUrl + 'xiaoqu/chargeyue',
          data: {
            xqid: options.xqid
          },
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (response) {
            console.log(response);
            var data = response.data.data;
            var list = data.recharge,rule_list = data.fee_scale;
            for (let i = 0; i < list.length; i++) {
              that.setData({
                recharge_cid: list[0].id,
                cash_money: list[0].money
              })
            }
            for (let i = 0; i < rule_list.length; i++) {
              that.setData({
                recharge_maxrule: rule_list[2].card_money,//收费标准
              })
            }
            if (data.extra.activity_id == 1 || data.extra.is_new_reward==1){
              that.setData({
                give_is_no: 1
              })
            }else{
              that.setData({
                give_is_no: 0
              })
            }
            that.setData({
              num_moneylist: data.recharge,
              activity_id: data.extra.activity_id,
              money: data.u_balance_money,
              xq_name: data.xq_name,
              xq_city:data.xq_city,
              recharge_rule:data.fee_scale,
              is_new_reward: data.extra.is_new_reward,
              extra_title: data.extra.title,
              expiry_time: data.extra.expiry_time
            })
          },
          fail: function (err) {
            console.log(err);
          }
        });
    } else if (that.data.state_id==3){
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