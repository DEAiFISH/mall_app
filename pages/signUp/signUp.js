// pages/signUp/signUp.js
var http = require("../../utils/http.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxId: '',
    nickName: '',
    realName: '',
    birthday: '',
    password: '',
    paymentPassword: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  // 获取输入框的值
  getInputVal: function(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      [type]: e.detail.value // 动态设置数据
    });
  },

  // 处理注册
  handleSignUp: function() {
    const { wxId, nickName, realName, birthday, password, paymentPassword } = this.data;

    // 验证输入
    if (!wxId || !nickName || !realName || !birthday || !password || !paymentPassword) {
      wx.showToast({
        title: '请填写所有字段',
        icon: 'none'
      });
      return;
    }

    // 验证生日格式
    const birthdayRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD 格式
    if (!birthdayRegex.test(birthday)) {
      wx.showToast({
        title: '生日格式不正确，请使用 YYYY-MM-DD',
        icon: 'none'
      });
      return;
    }

    // 检查微信ID是否存在
    this.checkWxIdExists(wxId, (exists) => {
      if (exists) {
        wx.showToast({
          title: '微信号已存在',
          icon: 'none'
        });
        return;
      }

      // 发送注册请求
      const params = {
        url: '/user/v1/sign-up',
        method: 'POST',
        data: {
          wxId,
          nickName,
          realName,
          birthday,
          password,
          paymentPassword
        },
        callBack: (res) => {
          if (res.code === "00000") {
            wx.showToast({
              title: '注册成功',
              icon: 'success'
            });
            // 注册成功后可以跳转到登录页面或首页
            wx.navigateTo({
              url: '/pages/login/login',
            });
          } else {
            wx.showToast({
              title: res.msg || '注册失败',
              icon: 'none'
            });
          }
        }
      };
      http.request(params);
    });
  },

  // 检查微信ID是否存在
  checkWxIdExists: function(wxId, callback) {
    if (!wxId) {
      callback(false); // 如果微信ID为空，直接返回不存在
      return;
    }

    var params = {
      url: `/user/v1/get/exists/${wxId}`,
      method: "GET",
      callBack: (res) => {
        if (res.code === "00000") {
          callback(res.data); // 返回微信ID是否存在
        } else {
          wx.showToast({
            title: res.msg || '检查失败',
            icon: 'none'
          });
          callback(false); // 检查失败时也返回不存在
        }
      }
    };
    http.request(params);
  }
})