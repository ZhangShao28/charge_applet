//app.js
var qcloud = require('./vendor/wafer-client-sdk/index.js');
var config = require('./config.js');
var checkNetWork = require("./utils/CheckNetWork.js");
var gloabalFomIds = [];
App({
  onLaunch: function (options) {
    if (wx.getUpdateManager) {
      wx.getUpdateManager()
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '新版本已经准备好，请删除小程序后,重新搜索小码充电'
      })
    }
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)

    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })

    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    })


    var that = this;
      // that.login();

       var formIds = gloabalFomIds; // 获取gloabalFomIds
          if (formIds.length) {//gloabalFomIds存在的情况下 将数组转换为JSON字符串
            // formIds = JSON.stringify(formIds);
            gloabalFomIds = '';
          }
         gloabalFomIds = formIds;
  },
  // login:function(){
  //   var that = this;
  //   // 登录
  //   qcloud.setLoginUrl(config.service.loginUrl);
  //   qcloud.login({
  //     success: function (userInfo) {
  //       console.log('登录成功', userInfo);
  //       that.globalData.userInfo = userInfo;
  //       // wx.setStorageSync('user', userInfo)
  //       var val = wx.getStorageSync('loc');
  //       if (val != '') {

  //       } else {
  //         wx.setStorageSync('loc', userInfo)
  //         that.getLocation();
  //       }
    
  //     },
  //     fail: function (err) {
  //       console.log('登录失败', err);
  //       wx.hideLoading();
  //       // if (err.LoginError.message =='微信登录失败，请检查网络状态'){
  //       //   wx.showModal({
  //       //     title: '',
  //       //     content: '微信登录失败，请检查网络状态',
  //       //     showCancel: false,
  //       //     success: function (res) {
  //       //       if (res.confirm) {
           
  //       //       }
  //       //     }
  //       //   })
  //       // }else{
  //       wx.showModal({
  //         title: '授权提示',
  //         content: '小程序需要您的微信授权才能使用，点击确定去授权',
  //         showCancel:false,
  //         success: function (res) {
  //           if (res.confirm) {
  //             // wx.openSetting({
  //             //   success: function (res) {
  //             //     //尝试再次登录
  //             //     that.login();
  //             //   }
  //             // })
  //           }
  //         }
  //       })
  //       }
  //     // }
  //   });
  // },
  getLocation:function(){
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        wx.reLaunch({
          url: './index',
        })
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
          title: '',
          content: '请允许小程序使用您的定位功能',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success: function (res) {
                  //尝试再次定位
                  that.getLocation();
                }
              })
            }
          }
        })
      }
    })
  },
  dealFormIds: function (formId) {
    var that = this;
    let formIds = that.globalData.gloabalFomIds;//获取全局数据中的推送码gloabalFomIds数组
    if (!formIds) formIds = [];
    let data = {
      formId: formId,
      expire: parseInt(new Date().getTime() / 1000) + 604800, //计算7天后的过期时间时间戳
      num: 1
    }
    formIds.push(data);//将data添加到数组的末尾
    that.globalData.gloabalFomIds = formIds; //保存推送码并赋值给全局变量
  },
  globalData: {
    userInfo: null,
    qcloud: qcloud,
    config: config,
    gloabalFomIds:[],
    checkNetWork: checkNetWork,
    sid:'weapp_session_F2C224D4-2BCE-4C64-AF9F-A6D872000D1A',
  }
})