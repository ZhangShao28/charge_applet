//index.js
//获取应用实例
var app = getApp().globalData;
var apps = getApp();
Page({
  data: {
    switch_btn: {
      btnsrc: '../../images/Turn-off@3x.png',
      roundsrc: '../../images/Round@3x.png',
      animationData: {}
    },
    charging_img:2,
    flag: true,
    xqname:'请选择小区',
    rule_state:'',
    rule_money:'',
    bgImage:'../../images/bg@3x.png',
    srcjt:'../../images/triangle@2x.png',
    srcjts:'../../images/1triangle@3x.png',
    srcjts_no:"../../images/1triangle@3x.png",
    is_bind_mobile:'',//是否绑定手机号
    is_no:1,
    // 附近没有充电设备
    no_src:'../../images/nosrc@3x.png',
    no_electry:'../../images/electricity@3x.png',
    xq_id:'',
    deviceid:'',
    q:'',
    scan_state:2,
    is_new: '',//是否是新人
    rest_num: '',//剩余免费充电次数
    end_time: '',//截至日期
    getuserinfo_state:false,
    showmask:false,
    showauthor:false,
    showlocal: false,
    message:''//新人免费几天冲几次
    // switchChecked:false//switch开关状态
  },
  //点击switch切换状态
  switchChange:function(e){
    var that = this;
    var pid = e.currentTarget.dataset.pid, sid = e.currentTarget.dataset.sid 
    if (e.detail.value == true) {
      wx.showModal({
        title: '提示',
        content: '确定开启短信提醒吗？',
        success: function (res) {
          if (res.confirm) {
            wx.showToast({
              title: pid + '您已开启短信通知',
            })
          } else if (res.cancel) {
            that.setData({
              switchChecked: false
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: pid + '您已关闭短信通知',
      })

    } 

  },
  // clickSwitch: function (e) {
  //   console.log(e)
  //   var thiss = this
  //   var animation = wx.createAnimation({
  //     duration: 200,
  //     timingFunction: 'linear',
  //   })
  //   this.animation = animation;
  //   if (this.flag) {
  //     thiss.flag = false;
  //     animation.translate(0).step();
  //     thiss.setData({
  //       'switch_btn.btnsrc': '../../images/Turn-off@3x.png',
  //       'switch_btn.animationData': animation.export()
  //     })
  //   } else {
  //     wx.showModal({
  //       title: '提示',
  //       content: '确定开启短信提醒吗？',
  //       success: function (res) {
  //         if (res.confirm) {
  //           thiss.flag = true
  //           animation.translate(20).step();
  //           thiss.setData({
  //             'switch_btn.btnsrc': '../../images/button@3x.png',
  //             'switch_btn.animationData': animation.export()
  //           })
  //         } else if (res.cancel) {
  //           // console.log('用户点击取消')
  //         }
  //       }
  //     })

  //   }
  // },
  //事件处理函数
  go_new_active:function(){
    wx.showModal({
      title: '新用户免费充电次数,余' + this.data.rest_num+'次',
      content: '有效时间截至：' + this.data.end_time,
      showCancel: false,
      confirmText: '确定'
    })
  },
  ScanBtn:function(){
    var that = this;
    if (!app.checkNetWork.checkNetWorkStatu()) {
      console.log('网络错误')
    } else {
      
        wx.scanCode({
          success: (res) => {
            var scan_id = res.result.split('/')[4]
            console.log("内部扫码", res, scan_id, that.data.is_bind_mobile)
            that.setData({
              deviceid: scan_id,
              scan_state:1
            })
                if (that.data.is_bind_mobile == 'y') {
                  wx.navigateTo({
                    url: '../electricize/electricize?state=55&deviceid=' + scan_id,
                  })
                } else if (that.data.is_bind_mobile == 'n') {
                  wx.navigateTo({
                    url: '../bindinfo/bindinfo?state=55&deviceid=' + scan_id
                  })
                } else {
                  wx.showLoading({
                    title: '请求超时',
                  })
                  setTimeout(function () {
                    wx.hideLoading()
                  }, 1000)
                }

          }
        })
 
    }
  },
  Scan_Submit:function(e){
    let formId = e.detail.formId;
    if (formId == "the formId is a mock one") {

    } else {
      apps.dealFormIds(formId);
      app.config.up_formid(formId)
    }
  },
  go_myinfo:function(){
    var that = this;
    if (!app.checkNetWork.checkNetWorkStatu()) {
      console.log('网络错误')
    } else {
      if (that.data.is_bind_mobile == 'y') {
        wx.navigateTo({
          url: '../myinfo/myinfo',
        })
      } else if (that.data.is_bind_mobile == 'n'){
        wx.navigateTo({
          url: '../bindinfo/bindinfo?m_type=1&xqid=' + that.data.xq_id
        })
      }else{
        wx.showLoading({
          title: '请求超时',
        })
        setTimeout(function(){
          wx.hideLoading()
        },1000)
      }
    }

  },
  go_chargelog:function(){
    wx.navigateTo({
      url: '../myrechargelog/myrechargelog',
    })
  },
  go_parkdetail:function(e){
    if (e.currentTarget.dataset.use==0){
      wx.showToast({
        title: '暂无可用设备',
        image:'../../images/cuo@2x.png'
      })
    }else{
      wx.navigateTo({
        url: '../parkdetail/parkdetail?id=' + e.currentTarget.dataset.id,
      })
    }
  },
  go_charge:function(){
    var that = this;
    if (!app.checkNetWork.checkNetWorkStatu()) {
      console.log('网络错误')
    } else {
      if (that.data.is_bind_mobile == 'y') {
        if (that.data.rule_state==1){//月卡充值
          wx.navigateTo({
            url: '../rechargeMonth/rechargeMonth?id=1&phone_id=1&xqid=' + that.data.xq_id,
          })
        } else if (that.data.rule_state == 2){//现金充值
          wx.navigateTo({
            url: '../rechargeCash/rechargeCash?id=2&phone_id=1&xqid=' + that.data.xq_id,
          })
        }
    
      } else if (that.data.is_bind_mobile == 'n') {
        wx.navigateTo({
          url: '../bindinfo/bindinfo?m_type=1&xqid=' + that.data.xq_id
        })
      } else {
        wx.showLoading({
          title: '请求超时',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      }
    }
  },
  changXiaoqu:function(){
    wx.navigateTo({
      url: '../plotselect/plotselect?xqid=' + this.data.xq_id
    })
  },
  // go_parkdetail:function(e){
  //   var pid = e.currentTarget.dataset.pid
  //   wx.navigateTo({
  //     url: '../parkdetail/parkdetail?id=' + pid
  //   })
  // },
  getuserinfo:function(e){
    console.log(e.detail.errMsg)
    var that = this;
    that.setData({
      showmask: false,
      showauthor: false
    })
    if (e.detail.errMsg =='getUserInfo:ok'){
      that.setData({
        getuserinfo_state:true
      })
      // that.login();
      wx.reLaunch({
        url: '../index/index',
      })
    } else if (e.detail.errMsg == 'getUserInfo:fail auth deny'){
      that.setData({
        getuserinfo_state: false
      })
      wx.showModal({
        title: '授权提示',
        content: '小程序需要您的微信授权才能使用，点击确定去授权',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            that.setData({
              showmask: true,
              showauthor: true
            })
            // wx.openSetting({
            //   success: function (res) {
            //     //尝试再次登录
            //     that.login();
            //   }
            // })


          }
        }
      })
    }
    
  },
    login:function(){
    var that = this;
    // 登录
    app.qcloud.setLoginUrl(app.config.service.loginUrl);
    app.qcloud.login({
      success: function (userInfo) {
        console.log('登录成功', userInfo);
        // that.globalData.userInfo = userInfo;
        // wx.setStorageSync('user', userInfo)
        var val = wx.getStorageSync('loc');
        if (val != '') {

        } else {
          wx.setStorageSync('loc', userInfo)
          // that.getLocation();
        }
        that.setData({
          showmask: false,
          showauthor: false
        })
      },
      fail: function (err) {
        console.log('登录失败', err);
        wx.hideLoading();
        that.setData({
          showmask:true,
          showauthor:true
        })
        // if (err.LoginError.message =='微信登录失败，请检查网络状态'){
        //   wx.showModal({
        //     title: '',
        //     content: '微信登录失败，请检查网络状态',
        //     showCancel: false,
        //     success: function (res) {
        //       if (res.confirm) {

        //       }
        //     }
        //   })
        // }else{
        // wx.showModal({
        //   title: '授权提示',
        //   content: '小程序需要您的微信授权才能使用，点击确定去授权',
        //   showCancel:false,
        //   success: function (res) {
        //     if (res.confirm) {
        //       wx.openSetting({
        //         success: function (res) {
        //           //尝试再次登录
        //           that.login();
        //         }
        //       })
        //     }
        //   }
        // })
        }
      // }
    });
  },
  onLoad: function (options) {
    var that = this, pid = pid, xqid = options.xqid;
    var q = decodeURIComponent(options.q)
    var scan_id_w = q.split('/')[4]
    that.login();
    wx.getSystemInfo({
      success: function(res) {
        if (res.version<'6.5.8'){//微信版本过低
          wx.showModal({
            title: '',
            content: '微信版本过低，无法正常使用小程序，请升级微信到最新版本',
            showCancel: false,
            confirmText: '确定'
          })
        }else{
          if (scan_id_w == undefined || scan_id_w == null) {
            scan_id_w = '';
          }
          if (xqid == undefined || xqid == null) {
            xqid = '';
          }
          if (options.ftype == 1) {
            wx.navigateTo({
              url: '../account/account?order_no=' + options.fdata,
            })
          } else if (options.ftype == 2) {
            wx.navigateTo({
              url: '../myinfo/myinfo',
            })
          } else {
            that.setData({
              deviceid: scan_id_w,
              xq_id: xqid,
              q: q
            })
              that.loadshow(xqid, q, scan_id_w)
          }
        }
      },
    })
  },
  loadshow: function (xq_id, q, scan_id){
    wx.showLoading({
      title: '加载中',
    })
    var that = this, flag;
    // if (wx.getStorageSync('loc')) {//判断是否授权
      // console.log(wx.getStorageSync('key'))
      if (wx.getStorageSync(app.sid)) {
        flag = 0
      } else {
        flag = 1
      }
      // flag = wx.getStorageSync(app.sid)?'0':'1'
    // 获取经纬度
        wx.getLocation({
          type: 'wgs84',
          success: function (res) {
            that.setData({
              showmask: false,
              showlocal: false
            })
            var latitude = res.latitude
            var longitude = res.longitude
            var speed = res.speed
            var accuracy = res.accuracy
            //获取小区及小区充电桩
            app.qcloud.request({
              url: app.config.service.hostUrl + 'xiaoqu/index',
              data: {
                // lon: '118.173797',
                // lat: '24.488718',
                lon: res.longitude,
                lat: res.latitude,
                xqid: xq_id
              },
              login: flag,
              method: 'POST',
              header: { 'content-type': 'application/x-www-form-urlencoded' },
              success: function (response) {
                // that.setData({
                //   netWork_state: 1
                // })
                wx.hideLoading()
                var list = response.data.data;
                console.log(response, "xq_id", list.xqid);
                console.log("q",q)
                if (q == null){
                  q = 'undefined'
                }
                if (q != 'undefined'&& list.is_bind_mobile != 'n') {//微信扫码充电跳转充电确认页面
                  that.setData({
                    is_bind_mobile: list.is_bind_mobile
                  })
                  if (response.data.err == 2) {//未定位到
                    that.setData({
                      is_no: 2
                    })

                  } else {
                    that.setData({
                      xqname: list.xq_name,
                      park_list: list.xq_place,
                      xq_id: list.xqid,
                      rule_state: list.card_type,
                      xq_card_times: list.xq_card_times,
                      rule_money: list.charge_money
                    })
                  }
                  wx.navigateTo({
                    url: '../electricize/electricize?state=5&deviceid=' + scan_id,
                  })
                } else if (q != 'undefined' && list.is_bind_mobile == 'n'){//扫码充电未绑定手机号跳转手机号绑定zxc
                    wx.navigateTo({
                      url: '../bindinfo/bindinfo?state=5&deviceid=' + scan_id,
                    })//zxc
                }else {//直接进入首页
                  if (list.is_charging=="y"){
                      that.setData({
                        charging_img: 1
                      })
                    }else{
                      that.setData({
                        charging_img: 2
                      })
                    }
                  that.setData({
                    is_bind_mobile: list.is_bind_mobile
                  })
                  if (response.data.err == 2) {//未定位到
                    that.setData({
                      is_no: 2
                    })

                  } else {
                    that.setData({
                      xqname: list.xq_name,
                      park_list: list.xq_place,
                      xq_id: list.xqid,
                      rule_state: list.card_type,
                      xq_card_times: list.xq_card_times,
                      rule_money: list.charge_money,
                      is_new: list.new_award.is_new,//是否是新人
                      rest_num: list.new_award.rest_num,//剩余免费充电次数
                      end_time: list.new_award.end_time,//截至日期
                      message: list.new_award.message,//截至日期
                    })
                  }
                }

              },
              fail: function (err) {
                wx.hideLoading();
                // that.setData({
                //   netWork_state:0
                // })
                if (that.data.getuserinfo_state==false){

                }else{
                  wx.showModal({
                    title: '',
                    content: '请求超时，请检查网络是否正常！',
                    showCancel: false,
                    confirmText: '关闭'
                  })
                }
             
              }
            });
          },
          fail: function (err) {
            wx.hideLoading();
            // wx.showModal({
            //   title: '',
            //   content: '请打开手机的定位功能',
            //   showCancel: false,
            //   confirmText: '关闭'
            // })
            wx.showModal({
              title: '定位失败',
              content: '未获取到您的地理位置,暂时无法为您提供服务,请在手机设置中打开定位功能',
              showCancel: false,
              confirmText: '知道了',
              success: function (res) {
                if (res.confirm) {
                  that.setData({
                    showmask: true,
                    showlocal: true
                  })
                  // wx.openSetting({
                  //   success: function (res) {
                  //     //尝试再次定位
                  //     that.loadshow();
                  //   }
                  // })
                }
              }
            })
          }
        })
    // }else{
    //   console.log("登陆失效")
    // }
  },
  onReady: function () {

  },
  onShow:function(){
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        if (res.version < '6.5.8') {//微信版本过低
          wx.showModal({
            title: '',
            content: '微信版本过低，无法正常使用小程序，请升级微信到最新版本',
            showCancel: false,
            confirmText: '确定'
          })
        }else{
          if (that.data.scan_state == 1) {

          } else {
            var xq_id = "", q = 'undefined', scan_id = '';
            if (!app.checkNetWork.checkNetWorkStatu()) {
              console.log('网络错误')
            } else {
              that.loadshow(that.data.xq_id, q, scan_id);
            }
          }
        }
      },
    })
  

  },
  onPullDownRefresh:function(){
    var xq_id="", q = 'undefined', scan_id='';
    if (!app.checkNetWork.checkNetWorkStatu()) {
      console.log('网络错误')
    } else {
      this.loadshow(xq_id, q, scan_id);
 
    }
    wx.stopPullDownRefresh();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '小码充电',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
        console.log("转发成功")
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败")
      }
    }
  }
})
