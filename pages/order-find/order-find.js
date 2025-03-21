// pages/order-find/order-find.js
var http = require('../../utils/http.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    current: 1,
    pages: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const userId = wx.getStorageSync("userInfo").id; 
    this.loadOrderData(userId, 1);
  },

  /**
   * 加载订单数据
   */
  loadOrderData: function(userId, current) {
    var ths = this;
    wx.showLoading();

    http.request({
      url: `/order/v1/list?userId=${userId}&isDelete=1`,
      method: "GET",
      callBack: function(res) {
        wx.hideLoading();
        if (res.code === "00000") {
          var list = [];
          if (current == 1) {
            list = res.data;
          } else {
            list = ths.data.list;
            Array.prototype.push.apply(list, res.data);
          }
          ths.setData({
            list: list,
            current: res.current,
            pages: res.pages
          });
        } else {
          wx.showToast({
            title: res.msg || '加载订单失败',
            icon: 'none'
          });
        }
      }
    });
  },

  /**
   * 恢复订单
   */
  recoverOrder: function(e) {
    var ordernum = e.currentTarget.dataset.ordernum;
    var ths = this;
    wx.showModal({
      title: '提示',
      content: '确定要恢复此订单吗？',
      success(res) {
        if (res.confirm) {
          http.request({
            url: `/order/v1/update/recover/${ordernum}`,
            method: "PUT",
            callBack: function(res) {
              if (res.code === "00000") {
                wx.showToast({
                  title: '恢复成功',
                  icon: 'success'
                });
                // 重新加载数据
                const userId = wx.getStorageSync("userInfo").id;
                ths.loadOrderData(userId, 1);
              } else {
                wx.showToast({
                  title: res.msg || '恢复失败',
                  icon: 'none'
                });
              }
            }
          });
        }
      }
    });
  },

  /**
   * 查看订单详情
   */
  toOrderDetailPage: function(e) {
    wx.navigateTo({
      url: '/pages/order-detail/order-detail?orderNum=' + e.currentTarget.dataset.ordernum,
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
  onReachBottom: function() {
    if (this.data.current < this.data.pages) {
      const userId = wx.getStorageSync("userInfo").id;
      this.loadOrderData(userId, this.data.current + 1);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})