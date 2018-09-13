// pages/bindinfo/bindinfo.js
var app = getApp().globalData;
var apps = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhone: '',
    userCode: '',
    verify_txt: '获取验证码',
    tag: true,
    dis: '',
    c_type:'',
    m_type: '',
    state: '',
    deviceid: '',
    go_bindphone:true
    // dis_btn:'disabled'
  },
  user_phone: function (e) {
    this.setData({
      userPhone: e.detail.value
    })
  },
  user_code: function (e) {
    this.setData({
      userCode: e.detail.value
    })
  },
  verify: function () {
    var that = this;
    var mobile = that.data.userPhone
    if (mobile.length == 0) {
      wx.showToast({
        title: '请输入手机号！',
        image: '../../images/cuo@2x.png',
        duration: 1500
      })
      return false;
    }
    if (mobile.length != 11) {
      wx.showToast({
        title: '手机号长度有误！',
        image: '../../images/cuo@2x.png',
        duration: 1500
      })
      return false;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(mobile)) {
      wx.showToast({
        title: '手机号有误！',
        image: '../../images/cuo@2x.png',
        duration: 1500
      })
      return false;
    }
    return false
  },
  next_btn: function (e) {
    console.log(e)
    let formId = e.detail.formId;
    apps.dealFormIds(formId);
    app.config.up_formid(formId)
  },
  go_protocol: function () {//用户协议
    wx.navigateTo({
      url: '../protocol/protocol',
    })
  },
  access_verify: function () {
    var that = this, mobile = that.data.userPhone;
    console.log(mobile)
    that.verify();
      if (mobile.length < 11) {
        wx.showToast({
          title: '手机号有误！',
          image: '../../images/cuo@2x.png',
          duration: 1500
        })
      } else {
        app.qcloud.request({
          url: app.config.service.hostUrl + 'user/code',
          data: {
            mobilephone: mobile,
          },
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (response) {
            if (response.data.err==1){
              wx.showToast({
                title: '发送成功',
                image: '../../images/dui@2x.png',
                duration: 1500
              })
            }else{
              wx.showToast({
                title: '发送失败,请重试',
                image: '../../images/cuo@2x.png',
                duration: 1500
              })
              that.setData({
                dis: '0',
                verify_txt: '获取验证码',
              })
            }
          },
          fail: function (err) {
            console.log(err);
          }
        });

        var num = 60
        var timer = setInterval(function () {
          num--;
          that.setData({
            dis: '1',
            verify_txt: num + 's',
          })
          if (num == 0) {
            clearInterval(timer);
            that.setData({
              dis: '0',
              verify_txt: '获取验证码',
            })
          }
        }, 1000)
      }

  },
  checkinput: function (e) {
    // var that = this
    // var query = wx.createSelectorQuery();
    // console.log(query.select(".input"))
    // if (e.detail.value!=""){
    //   that.setData({
    //     dis_btn: '',
    //   })
    // }
  },
  go_bindphone: function () {
    var that = this, userCode = that.data.userCode, mobile = that.data.userPhone;
    console.log(userCode, mobile)
    // that.verify();
    that.setData({
      go_bindphone:false
    })

    app.qcloud.request({
      url: app.config.service.hostUrl + 'user/checkcode',
      data: {
        mobile_phone: mobile,
        code: userCode,
        xqid: that.data.xqid,
        deviceid: that.data.deviceid
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (response) {
        console.log("充值状态", response.data.data.state,response,);
       var recharge_id = response.data.data.state
        // var data = response.data.data;
        if (response.data.err == '0' || response.data.err == '2' || response.data.err == '3'){
          that.setData({
            go_bindphone: true
          })
        }
        if (response.data.err == '0') {//验证码错误
          wx.showToast({
            title: response.data.msg,
            image: '../../images/cuo@2x.png',
            duration: 1500
          })
        } else if (response.data.err == '1') {//绑定成功
          console.log("m_type", that.data.m_type)
          if (that.data.m_type==1){
              wx.showToast({
                title: response.data.msg,
                image: '../../images/dui@2x.png',
                duration: 1500,
                success: function () {
                  setTimeout(function () {
                    wx.navigateTo({
                      url: '../myinfo/myinfo'
                    })
                  }, 2000)
                }
              })
            }else if(that.data.state==5){//外部扫码进入绑定流程->进入充值
                wx.showToast({
                  title: response.data.msg,
                  image: '../../images/dui@2x.png',
                  duration: 1500,
                  success: function () {
                    setTimeout(function () {
                      if (recharge_id ==1){//月卡
                        wx.navigateTo({
                          url: '../rechargeMonth/rechargeMonth?id=' + recharge_id + '&xqid=' + response.data.data.xqid + '&deviceid=' + that.data.deviceid + '&state=' + that.data.state,
                        })
                      } else if (recharge_id==2){//现金
                        wx.navigateTo({
                          url: '../rechargeCash/rechargeCash?id=' + recharge_id + '&xqid=' + response.data.data.xqid + '&deviceid=' + that.data.deviceid + '&state=' + that.data.state,
                        })
                      } else if (recharge_id==4){//有免费次数跳转充电
                        wx.reLaunch({
                          url: '../electricize/electricize?state=5&deviceid=' + that.data.deviceid,
                        })
                      }
                    }, 2000)
                  }
                })

          } else if (that.data.state == 55) {//内部扫码进入绑定流程->进入充值
            wx.showToast({
              title: response.data.msg,
              image: '../../images/dui@2x.png',
              duration: 1500,
              success: function () {
                setTimeout(function () {
                  if (recharge_id == 1) {//月卡
                    wx.navigateTo({
                      url: '../rechargeMonth/rechargeMonth?id=' + recharge_id + '&xqid=' + response.data.data.xqid + '&deviceid=' + that.data.deviceid + '&state=' + that.data.state,
                    })
                  } else if (recharge_id == 2) {//现金
                    wx.navigateTo({
                      url: '../rechargeCash/rechargeCash?id=' + recharge_id + '&xqid=' + response.data.data.xqid + '&deviceid=' + that.data.deviceid + '&state=' + that.data.state,
                    })
                  } else if (recharge_id == 4) {//有免费次数跳转充电
                    wx.reLaunch({
                      url: '../electricize/electricize?state=55&deviceid=' + that.data.deviceid,
                    })
                  }
                }, 2000)
              }
            })

          } else{
                  if (response.data.data.state==3){
                      wx.reLaunch({
                        url: '../index/index',
                      })
                  }else{
                      wx.showToast({
                        title: response.data.msg,
                        image: '../../images/dui@2x.png',
                        duration: 1500,
                        success: function () {
                          setTimeout(function () {
                            if (recharge_id == 1) {//月卡
                              wx.navigateTo({
                                url: '../rechargeMonth/rechargeMonth?id=' + recharge_id + '&xqid=' + response.data.data.xqid,
                              })
                            } else if (recharge_id == 2) {//现金
                              wx.navigateTo({
                                url: '../rechargeCash/rechargeCash?id=' + recharge_id + '&xqid=' + response.data.data.xqid,
                              })
                            }
                          }, 2000)
                        }
                      })
                  }
        
          }
    
        } else if (response.data.err == '2') {//手机号码已被绑定过
          wx.showToast({
            title: response.data.msg,
            image: '../../images/cuo@2x.png',
            duration: 1500
          })
        } else if (response.data.err == '3') {//手机号或验证码为空
          wx.showToast({
            title: response.data.msg,
            image: '../../images/cuo@2x.png',
            duration: 1500
          })
        }
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
    console.log("绑定号码", options.xqid, options.m_type, options.state, options.deviceid)
      this.setData({
        xqid: options.xqid,//小区id
        m_type: options.m_type,//绑定后跳回原始目的地
        // c_type: options.c_type,//充值类型
        state: options.state,//扫码进入
        deviceid: options.deviceid//设备id
      })
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
    return {

    }
  }
})