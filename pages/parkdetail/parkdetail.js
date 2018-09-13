// pages/parkdetail/parkdetail.js
var app = getApp().globalData;
var apps = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    park_name: '',
    select_charge: '../../images/parkdetail/vacancy@2x.png',//可用
    // charge_use: '../../images/parkdetail/vacancy@2x.png',//空闲
    colors_vacancy: '#666',//空置
    select_colors: '#666',//选中
    color_use: '#ffbe00',//使用中
    state_no: '空置',
    state_use: '充电中',
    state_gz: '故障',
    colors: '#e5e5e5',//使用、故障
    charge: '../../images/parkdetail/line@2x.png',//故障
    charge_use:'../../images/parkdetail/Inthecharging@2x.png',//使用中
    select_id: null,
    uses:'',
    device_id: null,
    device_no: null,
    pid:'',
    btn_on:0,
    begin_btn_isno:true//防止按钮点击多次
  },
  select_item: function (e) {
    // console.log(e,e.currentTarget.id,e.currentTarget.dataset.id)
    if (e.currentTarget.id == 1) {
      this.setData({
        select_id: e.currentTarget.dataset.id,
        device_id: e.currentTarget.dataset.device_id,
        device_no: e.currentTarget.dataset.device_no,
        uses: '1',
        select_charge:'../../images/parkdetail/small_elctrcity.gif',
        btn_on:1
      })
      // console.log(this.data.device_id, this.data.device_no, this.data.uses)

    } else if (e.currentTarget.id==2){
      wx.showToast({
        title: '正在使用中',
        image:'../../images/cuo@2x.png'
      })
      this.setData({
        select_id: null,
        device_id: null,
        device_no: null,
        uses: '2',
        btn_on: 0
      })
    }else {
      wx.showToast({
        title: '设备已离线',
        image: '../../images/cuo@2x.png'
      })
      this.setData({
        select_id: null,
        device_id: null,
        device_no: null,
        uses: '2',
        btn_on: 0
      })
    }

    // console.log(e.currentTarget.dataset.id, this.data.colors )
  },
  begin_btn: function (options) {
    var that = this, deviceid, deviceno, pid;
    that.setData({
      begin_btn_isno:false//不可点击
    })
    if(this.data.uses ==1){
    // console.log(that.data.device_id, that.data.device_no, that.data.uses, that.data.pid)
    deviceid = that.data.device_id
        deviceno = that.data.device_no
        pid = that.data.pid
    app.qcloud.request({
      url: app.config.service.hostUrl +'xiaoqu/charge',
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
        // console.log("小区id",response, response.data.err, xq_id);
          if (state == 1) {//可以充电
              wx.navigateTo({
                url: '../electricize/electricize?deviceid=' + deviceid + '&deviceno=' + deviceno + '&pid=' + pid + '&order_no=' + response.data.data.order_no + '&state=0'
              })
          } else if (state == 2) {//需充值月卡
            wx.showModal({
              title: '',
              confirmText: '去购买',
              confirmColor: '#FFAC32',
              content: '您还未购买月卡 \r\n立即去购买',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../rechargeMonth/rechargeMonth?id=1&phone_id=1&xqid=' + xq_id,
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
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
                  wx.navigateTo({
                    url: '../rechargeCash/rechargeCash?id=2&phone_id=1',
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          } else if (state == 4) {//月卡次数用完
            wx.showToast({
              title: response.data.msg,
              icon: 'success',
              duration: 2000
            })
          } else if (state == 5){//未绑定手机号
            wx.navigateTo({
              url: '../bindinfo/bindinfo?xqid=' + xq_id
            })
          } else if (state == 6) {
            wx.showToast({
              title: response.data.msg,
              image: '../../images/cuo@2x.png',
              duration: 2000
            })
          } else if (state == 7) {
            wx.showToast({
              title: response.data.msg,
              image: '../../images/cuo@2x.png',
              duration: 2000
            })
          }else if(state==10){
              wx.showToast({
                title: response.data.msg,
                image:'../../images/cuo@2x.png',
                duration:2000
              })
          }
     
          that.setData({
            begin_btn_isno: true//可点击
          })

      },
      fail: function (err) {
        console.log(err);
      }
    });
    }else{
      that.setData({
        begin_btn_isno: true//可点击
      })
      wx.showToast({
        title: '请选择充电桩',
        image:'../../images/cuo@2x.png'
      })
    }
    // wx.showModal({
    //   title: '',
    //   confirmText: '去充值',
    //   confirmColor: '#FFAC32',
    //   content: '当前您的余额为0元\r\n请先充值后继续开启充电',
    //   success: function (res) {
    //     if (res.confirm) {
    //       wx.navigateTo({
    //         url: '../recharge/recharge',
    //       })
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // })
  },
  begin_Submit: function (e) {
    console.log(e)
    let formId = e.detail.formId;
    if (formId == "the formId is a mock one") {

    } else {
      apps.dealFormIds(formId);
      app.config.up_formid(formId)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    var that = this;
    // console.log("id:", options.id)
    that.setData({
      pid: options.id
    })
    that.load();
  },
  load:function(){
    var that = this;
    //充电桩列表
    app.qcloud.request({
      url: app.config.service.hostUrl + 'xiaoqu/detail',
      data: {
        pid: that.data.pid
      },
      // method: 'POST',
      // header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (response) {
        console.log(response);
        var data = response.data.data;
        that.setData({
          park_name: data.place_name,
          chargelist: data.device_arr
        })
      },
      fail: function (err) {
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
    this.setData({
      select_id: null,
      device_id: null,
      device_no: null,
    })
    this.load();
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
    this.setData({
      select_id: null,
      device_id: null,
      device_no: null,
    })
    this.load();
    wx.stopPullDownRefresh()
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