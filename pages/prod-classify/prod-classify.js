// pages/prod-classify/prod-classify.js
var http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sts: 0,
    prodList: [],
    title: "",
    current: 1,
    size: 10,
    pages: 0,
    tagid: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      current: 1,
      pages: 0,
      sts: options.sts,
      title: options.title ? options.title : ""
    });
    if (options.tagid) {
      this.setData({
        tagid: options.tagid
      });
    }

    // 获取用户 ID
    const userId = wx.getStorageSync("userInfo").id;

    // 加载用户收藏列表
    this.loadUserCollection(userId);

  },

  // 加载用户收藏列表
  loadUserCollection: function(userId) {
    var ths = this;
    wx.showLoading();
    var params = {
      url: `/product-collect/v1/list/${userId}`, // 获取收藏列表的接口
      method: "GET",
      data: {},
      callBack: function(res) {
        wx.hideLoading();
        if (res.code === "00000") {
          ths.setData({
            prodList: res.data // 更新商品列表为收藏的商品
          });
        } else {
          wx.showToast({
            title: res.msg || '加载收藏失败',
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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.current < this.data.pages) {
      this.setData({
        current: this.data.current + 1
      })
      this.loadProdData()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})