// pages/electricize/electricize.js
var app = getApp().globalData;
var apps = getApp();
var timers =null;
var timers_m = null;
var timer_charging = null;
var timers_s=null;
var time_m = 0;
var timer_orders=null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
        // car_name:'车辆1',
        park_locat:'充电桩',
        num:'000',
        phone:'0000-0000000',
        property_phone:'',
        connet_state:"",//0为正在连接，1为连接成功，2为连接失败，3为次数用完,4为服务器维护中,5为扫码充电
        con_state:'',
        connet_txt:'',
        pre:100,
        src1:'../../images/parkdetail/loads.gif',
        state2_img:'../../images/electricize/loading.png',//链接失败
        state2_txt:'车辆与设备连接失败',
        state2_btn:'请重试',
        order_no:'',
        pid: '',
        xqid:'',
        device_id: '',
        device_no: '',
        hour: '00',
        minute: '00',
        second: '00',
        is_no:1,
        state1_src:'../../images/electricize/electricize_ing.gif',
        begin_btn:true,//确认开始充电按钮是否可用
        over_btn_isno:true//结束充电按钮是否可用
  },
  go_our_kefu:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.phone,
    })
  },
  go_property_kefu:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.property_phone,
    })
  },
  Scan_Submits: function (e) {
    console.log(e)
    let formId = e.detail.formId;
    if (formId == "the formId is a mock one") {

    } else {
      apps.dealFormIds(formId);
      app.config.up_formid(formId)
    }
  },
  over_btn:function(){
    var that = this; 
    that.setData({
      over_btn_isno:false
    })
    console.log('充电结束',that.data.order_no)
    app.qcloud.request({
      url: app.config.service.hostUrl + 'charging/endorder',
      data: {
        order_no:that.data.order_no,
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (response) {
        console.log(response)

        wx.redirectTo({
          url: '../account/account?order_no=' + that.data.order_no,
        })
      },
      fail: function (err) {
        console.log(err);
      }
    });
  },
  go_repair:function(){
      wx.navigateTo({
        url: '../repair/repair?xqid=' + this.data.xqid + '&device_id=' + this.data.device_id + '&device_no=' + this.data.device_no,
      })
  },
  begin_connet:function(){
    var that =this;
    that.setData({
        state2_img:'../../images/electricize/loads.gif',
        state2_txt:'正在连接你的车辆',
        state2_btn:'正在连接',
        state2_btn_show: 2
      })
      that.chongshi();
      that.connect();
      // var n = 1
      // timers_s = setInterval(function () {
      //  console.log("chonglian")
      //   n++;
      //   if (n > 30) {
      //     clearInterval(timers_s);
      //     that.setData({
      //       connet_state: 2,
      //       state2_img: '../../images/electricize/loading.png',
      //       state2_txt: '车辆与设备连接失败',
      //       state2_btn: '请重试',
      //       state2_btn_show: 1
      //     })
      //     console.log(that.data.connet_state)
      //   } else if (0 < n <= 30) {
      //     that.connect();
      //   }
      // }, 2000)
  },
  begin_btn:function(){//确认扫码充电
    var that = this;
    that.setData({
      begin_btn:false//按钮不可点
    })
      that.chongshi();
      console.log(that.data.dev_state)
      that.connect();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  chongshi:function(){
    var that = this;
    console.log("重试", that.data.order_no, that.data.con_state, that.data.pid, that.data.device_id, that.data.device_no)
    app.qcloud.request({
      url: app.config.service.hostUrl + 'xiaoqu/charge',
      data: {
        pid: that.data.pid,
        device_id: that.data.device_id,
        device_no: that.data.device_no
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (response) {
        var state = response.data.err,
          xq_id = response.data.data.xqid
        console.log(response, response.data.err);
        if (state == 1) {//可以充电
            if (that.data.con_state == 5 || that.data.con_state == 55) {
              that.setData({
                dev_state: state,
                order_no: response.data.data.order_no,
                state0_img: '../../images/electricize/charge_1.gif',
                connet_state: 0,
                connet_txt:'你的插座已通电'
              })
              setTimeout(function(){
                that.setData({
                  state0_img: '../../images/electricize/charge_2.gif',
                  connet_txt: '平台正在连接你的电动车'
                })
              },2800)
              
            } else {
              that.setData({
                dev_state: state,
                order_no: response.data.data.order_no
              })
            }
        } else if (state == 2) {//需充值月卡
          wx.showModal({
            title: '',
            confirmText: '去购买',
            confirmColor: '#FFAC32',
            content: '您还未购买月卡,\r\n立即去购买',
            success: function (res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '../rechargeMonth/rechargeMonth?id=1&xqid=' + xq_id + '&deviceid=' + that.data.device_id+ '&state=' + that.data.con_state,
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
                wx.reLaunch({
                  url: '../index/index',
                })
              }
            }
          })
        } else if (state == 3) {//需充值现金
          wx.showModal({
            title: '',
            confirmText: '去充值',
            confirmColor: '#FFAC32',
            content: response.data.msg,
            success: function (res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '../rechargeCash/rechargeCash?id=2&xqid=' + xq_id + '&deviceid=' + that.data.device_id+'&state=' + that.data.con_state,
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
                wx.reLaunch({
                  url: '../index/index',
                })
              }
            }
          })
        } else if (state == 4) {//月卡次数用完
          wx.showToast({
            title: response.data.msg,
            image: '../../images/cuo@2x.png',
            duration: 2000
          })
          if (that.data.con_state == 55) {
            setTimeout(function () {
              wx.reLaunch({
                url: '../index/index',
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
              })
            }, 2000)
          }
        } else if (state == 5) {//未绑定手机号
          wx.redirectTo({
            url: '../bindinfo/bindinfo?xqid=' + xq_id + '&state=' + that.data.con_state
          })
        } else if (state >= 6) {
          wx.showToast({
            title: response.data.msg,
            image: '../../images/cuo@2x.png',
            duration: 2000,
            success: function () {
              setTimeout(function () {
                wx.reLaunch({
                  url: '../index/index',
                })
              }, 2000)
            }
          })
          that.setData({
            dev_state: state,
            dev_msg: response.data.msg,
            connet_state: 2,
            state2_img: '../../images/electricize/loading.png',
            state2_txt: '车辆与设备连接失败',
            state2_btn: '请重试',
            state2_btn_show: 1
          })
          clearInterval(timers);
          clearInterval(timers_s);
          clearInterval(timers_m);
        }
      },
      fail: function (err) {
        console.log(err);
      }
    });
  },

  connect:function(){
    console.log("订单号", this.data.order_no)
    clearInterval(timer_charging);
    clearInterval(timers_m);
    var that =this;
    app.qcloud.request({
      url: app.config.service.hostUrl + 'charging/cding',
      data: {
        order_no: that.data.order_no
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (response) {
        console.log(response,"返回",response.data.msg);
        var data = response.data;
          if(data.err==1){//连接成功
          console.log("连接成功")
          time_m=0;
          clearInterval(timers);
          clearInterval(timers_m);
          clearInterval(timers_s);
            that.setData({
              connet_state: 1,
              device_no: data.data.device_no,
              device_id: data.data.device_id,
              park_locat: data.data.place_name,
              phone:data.data.our_phone,
              xqid:data.data.xqid
            })
            var n = data.data.charge_time,h,m,s
            console.log('创建时间：',n)
            timer_charging = setInterval(function(){
              times();
              // console.log(h,m,s)
              that.setData({
                hour:h,
                minute:m,
                second:s
              })
            },1000)
            function times() {
              n++;
              h = Math.floor(n / 3600) < 10 ? '0' + Math.floor(n / 3600) : Math.floor(n / 3600);
              m = Math.floor((n / 60 % 60)) < 10 ? '0' + Math.floor((n / 60 % 60)) : Math.floor((n / 60 % 60));
              s = Math.floor((n % 60)) < 10 ? '0' + Math.floor((n % 60)) : Math.floor((n % 60));
              // total = h + ":" + m + ":" + s;
              return h,m,s;
            }
          } else if (data.err == 0){//连接失败继续连接
            that.setData({
              xqid: data.data.xqid
            })
            timers_m = setInterval(function () {
              console.log("connet", time_m)
              time_m++;
              if (time_m > 62) {
                clearInterval(timers_m);
                clearInterval(timers)
                clearInterval(timers_s)
                time_m = 0;
                if (data.data.property_phone == null) {
                  that.setData({
                    is_no: 0
                  })
                }
                that.setData({
                  connet_state: 2,
                  state2_btn_show: 1,
                  state2_img: '../../images/electricize/loading.png',
                  state2_txt: '车辆与设备连接失败',
                  state2_btn: '请重试',
                  phone: data.data.our_phone,
                  property_phone: data.data.property_phone
                })
              } else if (0 < time_m <=62) {
                that.connect();
              }
            }, 1000)
          }
      },
      fail: function (err) {
        console.log("失败",err);
        clearInterval(timers)
        clearInterval(timers_m)
        clearInterval(timer_charging)
        clearInterval(timers_s)
        wx.reLaunch({
          url: '../index/index',
        })
      }
    });
  },
  onLoad: function (options) {
    clearInterval(timers);
    clearInterval(timers_m);
    clearInterval(timer_charging);
    clearInterval(timers_s)
    clearInterval(timer_orders);
    var that = this, order_no = '', pid = '', deviceno = '', deviceid = '';
    console.log("充电页面", options.order_no, options.deviceid, options.state, options.pid, options.deviceno)
    if (options.deviceid == undefined || options.deviceid == null){
      deviceid=''
    }else{
      deviceid = options.deviceid
    }
    if (options.order_no == undefined || options.order_no == null) {
      order_no = ''
    } else {
      order_no = options.order_no
    }
    if (options.pid == undefined || options.pid == null) {
      pid = ''
    } else {
      pid = options.pid
    }
    if (options.deviceno == undefined || options.deviceno == null) {
      deviceno = ''
    } else {
      deviceno = options.deviceno
    }
    that.setData({
      order_no: order_no,
      con_state: options.state,
      pid: pid,
      device_id:deviceid,
      device_no: deviceno,
      
    })
    if (!app.checkNetWork.checkNetWorkStatu()) {
      console.log('网络错误')
    } else {
      if (options.state == 5) {//外部扫码进入
        that.setData({
          connet_state: 5,
        })
      } else if (options.state == 10) {
        that.setData({
          state0_img: '../../images/electricize/charge_1.gif',
          connet_state: 0,
          connet_txt: '您的插座已通电'
        })
       setTimeout(function () {
          that.setData({
            state0_img: '../../images/electricize/charge_2.gif',
            connet_txt: '平台正在连接您的电动车'
          })
        }, 2800)
        that.connect();
      } else if (options.state == 55) {//内部扫码进入
        that.setData({
          state0_img: '../../images/electricize/charge_1.gif',
          connet_state: 0,
          connet_txt: '您的插座已通电'
        })
        setTimeout(function () {
          that.setData({
            state0_img: '../../images/electricize/charge_2.gif',
            connet_txt: '平台正在连接您的电动车'
          })
        }, 2800)
      
        that.chongshi();
        that.connect();
        var n = 1
        timers = setInterval(function () {
          console.log("onload")
          n++;
          if (n > 62) {
            clearInterval(timers_m);
            clearInterval(timers)
            clearInterval(timers_s)
              n = 1;
            that.setData({
              connet_state: 2,
              state2_btn_show: 1
            })
          } else if (0 < n <= 30) {
            that.connect();
          }
        }, 1000)
      } else {
        that.setData({
          state0_img: '../../images/electricize/charge_1.gif',
          connet_state: 0,
          connet_txt: '您的插座已通电'
        })
        setTimeout(function () {
          that.setData({
            state0_img: '../../images/electricize/charge_2.gif',
            connet_txt: '平台正在连接您的电动车'
          })
        }, 2800)
        that.connect();
      }
    }
     timer_orders =  setInterval(function () {//检测订单是否结束,1分钟一次
      console.log("订单编号",that.data.order_no)
          app.qcloud.request({
            url: app.config.service.hostUrl + 'charging/orderstatus',
            data: {
              order_no: that.data.order_no
            },
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (response) {
              console.log("订单状态",response)
              var order_status = response.data.data.order_status
              if (order_status == '2' || order_status == '3') {//订单结束
                    that.over_btn()
                    clearInterval(timer_orders)
                } else {//正在充电
                   
                  }
            },
            fail: function (err) {
              console.log(err);
            }
          });
    },60000)
    // console.log( options.pid, options.deviceid, options.deviceno)
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
   this.setData({
     state1_src: '../../images/electricize/electricize_ing.gif',
     begin_btn: true//按钮可点
    })
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
    console.log('卸载')
    clearInterval(timers);
    clearInterval(timers_m);
    clearInterval(timer_charging);
    clearInterval(timers_s)
    clearInterval(timer_orders);
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