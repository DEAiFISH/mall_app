var http = require("../../utils/http.js");
var crypto = require("../../utils/crypto.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户名
    username: 'wx_id123',
    // 密码
    password: '123123',
    // 是否显示注册
    isRegister: false
  },

  onGotUserInfo: function (res) {
    http.updateUserInfo();
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isRegister: options.isRegister == 0
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

  },
  
  /**
   * 输入框的值
   */
  getInputVal: function(e) {
    const type = e.currentTarget.dataset.type
    if (type == 'account') {
      this.setData({
        username: e.detail.value
      })
    } else if (type == 'password') {
      this.setData({
        password: e.detail.value
      })
    }
  },

  /**
   * 注册/登录按钮
   */
  handleLoginOrRegister() {
    const that = this;
    if (!this.data.username.trim()) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none'
      });
      return;
    }
    if (!this.data.password.trim()) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      });
      return;
    }
    const params = {
      url: '/doLogin',
      method: "POST",
      data: {
        username: this.data.username,
        password: this.data.password
      },
      callBack: (res) => {
        console.log('登录结果:', res);
        if (res.token) {
          wx.setStorageSync('token', res.token);
          console.log('Token 已保存:', res.token);
          wx.setStorageSync('userInfo', res.data);
          if (this.data.isRegister) {
            that.setData({
              username: '',
              password: '',
              isRegister: !that.data.isRegister
            });
            wx.showToast({
              title: '注册成功，请登录',
              icon: 'none'
            });
          } else {
            wx.switchTab({
              url: '/pages/index/index',
            });
          }
        } else {
          wx.showToast({
            title: '登录失败，未获取到 token',
            icon: 'none'
          });
        }
      }
    };
    http.request(params);
  },

  // 跳转到注册页面
  goToSignUp: function () {
    wx.navigateTo({
      url: '/pages/signUp/signUp', // 跳转到注册页面
    });
  },
})
