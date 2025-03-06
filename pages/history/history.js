// pages/history/history.js
var http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyList: []
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    // 获取用户 ID
    const userId = wx.getStorageSync("userInfo").id;

    // 加载用户浏览历史
    this.loadUserHistory(userId);

  },

  // 加载用户浏览历史
  loadUserHistory: function(userId) {
    var ths = this;
    wx.showLoading();
    var params = {
      url: `/browse-history/v1/list/${userId}`,
      method: "GET",
      data: {},
      callBack: function(res) {
        wx.hideLoading();
        if (res.code === "00000") {
          ths.setData({
            historyList: res.data
          });
        } else {
          wx.showToast({
            title: res.msg || '加载浏览历史失败',
            icon: 'none'
          });
        }
      }
    };
    http.request(params);
  },

  // 商品详情
  toProdPage: function (e) {
    var prodid = e.currentTarget.dataset.prodid;
    wx.navigateTo({
      url: '/pages/prod/prod?prodid=' + prodid,
    })
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

  }
})