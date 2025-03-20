// pages/user-info/user-info.js
var http = require("../../utils/http.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    genderOptions: ['女','男', '未知'],
    userId: -1,
    wxId: "",
    nickName: "",
    realName: "",
    gender: "未知",
    birthday: "",
    avatar: "",
    phone: "",
    message: "",
    email: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getUserInfo();
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

  getUserInfo: function() {
    const userId = wx.getStorageSync("userInfo").id; 
    http.request({
      url: `/user/v1/get/${userId}`,
      method: 'GET',
      callBack: res => {
        if (res.data && res.success) {
          this.setData({
            userId: res.data.userId,
            wxId: res.data.wxId,
            nickName: res.data.nickName,
            realName: res.data.realName,
            gender: this.data.genderOptions[res.data.gender],
            birthday: res.data.birthday,
            avatar: res.data.avatar,
            phone: res.data.phone,
            message: res.data.message,
            email: res.data.email
          });
        } else {
          wx.showToast({
            title: '获取用户信息失败',
            icon: 'none'
          });
        }
      }
    });
  },

  onInputChange: function(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [field]: e.detail.value
    });
  },

  onGenderChange: function(e) {
    this.setData({
      gender: this.data.genderOptions[e.detail.value]
    });
  },

  submitUserInfo: function() {
    const data = {
      userId: this.data.userId,
      nickName: this.data.nickName,
      realName: this.data.realName,
      gender: this.data.genderOptions.indexOf(this.data.gender),
      birthday: this.data.birthday,
      phone: this.data.phone,
      message: this.data.message,
      email: this.data.email,
      status: 1
    };

    http.request({
      url: '/user/v1/update',
      method: 'PUT',
      data: data,
      callBack: res => {
        if (res.success) {
          wx.showToast({
            title: '修改成功',
            icon: 'success'
          });
          // 更新本地存储或页面数据
          this.setData({
            ...res.data
          });
        } else {
          wx.showToast({
            title: '修改失败',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '请求失败，请检查网络',
          icon: 'none'
        });
      }
    });
  }
})