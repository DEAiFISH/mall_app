// pages/category/category.js

var http = require("../../utils/http.js");
var config = require("../../utils/config.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selIndex: 0,
    categoryList:[],
    productList: [],
    categoryImg: '',
    prodid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var ths = this;
    //加载分类列表
    var params = {
      url: "/classify/v1/list?name=",
      method: "GET",
      callBack: function (res) {
        if (res.code === "00000") {
          ths.setData({
            categoryList: res.data,
            categoryImg: res.data[0].icon
          });
          ths.getProdList(res.data[0].classifyId);
        } else {
          wx.showToast({
            title: res.msg || '加载分类失败',
            icon: 'none'
          });
        }
      }
    };
    http.request(params);
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
   * 分类点击事件
   */
  onMenuTab: function (e) {
    var index = e.currentTarget.dataset.index;
    var classifyId = this.data.categoryList[index].classifyId;
    this.getProdList(classifyId);
    this.setData({
      categoryImg: this.data.categoryList[index].icon,
      selIndex: index
    });
  },

  // 跳转搜索页
  toSearchPage: function () {
    wx.navigateTo({
      url: '/pages/search-page/search-page',
    })
  },

  getProdList: function(classifyId) {
    var params = {
      url: `/product/v1/list?classifyId=${classifyId}`,
      method: "GET",
      callBack: (res) => {
        if (res.code === "00000") {
          this.setData({
            productList: res.data
          });
        } else {
          wx.showToast({
            title: res.msg || '加载商品失败',
            icon: 'none'
          });
        }
      }
    };
    http.request(params);
  },

//跳转商品详情页
  toProdPage: function (e) {
    var prodid = e.currentTarget.dataset.prodid;
    wx.navigateTo({
      url: '/pages/prod/prod?prodid=' + prodid,
    })
  },
})