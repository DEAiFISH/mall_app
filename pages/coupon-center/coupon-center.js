// pages/coupon-center/coupon-center.js

//获取应用实例
var http = require("../../utils/http.js");
var config = require("../../utils/config.js");
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    voucherList: [] // 存储优惠券列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getVoucherList(); // 加载优惠券列表
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

  loadVoucherList() {
    const voucherList = wx.getStorageSync('voucherList') || [];
    this.setData({
      voucherList: voucherList
    });
  },

  // 获取优惠券列表
  getVoucherList() {
    var params = {
      url: "/voucher/v1/list?name=",
      method: "GET",
      data: {},
      callBack: (res) => {
        if (res.code === "00000") { // 确保返回成功
          console.log('优惠券数据 ==> ', res.data);
          this.setData({
            voucherList: res.data
          });
        } else {
          wx.showToast({
            title: res.msg || '加载优惠券失败',
            icon: 'none'
          });
        }
      }
    };
    http.request(params);
  },
})