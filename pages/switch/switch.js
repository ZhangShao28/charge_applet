// pages/switch/switch.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    switch_btn: {
      btnsrc: '../../images/Turn-off@3x.png',
      roundsrc: '../../images/Round@3x.png',
      animationData: {}
    },
    flag: true
  },
  //点击switch切换状态
  // clickSwitch: function (e) {
  //   // console.log(this)
  //   var animation = wx.createAnimation({
  //     duration: 200,
  //     timingFunction: 'linear',
  //   })
  //   this.animation = animation;
  //   if (this.flag) {
  //     this.flag = false;
  //     console.log(1)
  //     animation.translate(0).step();
  //     this.setData({
  //       'switch_btn.btnsrc': '../../images/Turn-off@3x.png',
  //       'switch_btn.animationData': animation.export()
  //     })
  //   } else {
  //     this.flag = true
  //     console.log(2)
  //     animation.translate(20).step();
  //     this.setData({
  //       'switch_btn.btnsrc': '../../images/button@3x.png',
  //       'switch_btn.animationData': animation.export()
  //     })
  //   }
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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