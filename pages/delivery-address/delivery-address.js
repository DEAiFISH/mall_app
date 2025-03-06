// pages/delivery-address/delivery-address.js

var http = require("../../utils/http.js");
// var config = require("../../utils/config.js");

Page({
  data: {
    defaultSize: 'mini',
    disabled: false,
    plain: true,
    loading: false,
    addressList: [],
    addAddress: '',
    order: -1
  },
  onLoad: function (option) {
    if (option.order) {
      this.setData({
        order: option.order
      });
    }
  },

  onShow: function (option) {
    this.getAddressList(); // 获取用户收货地址
  },

  // 获取用户收货地址
  getAddressList: function () {
    var ths = this;
    wx.showLoading();
    var uId = wx.getStorageSync("userInfo").id; // 获取用户 ID
    var params = {
      url: `/shipping-address/v1/list/${uId}`,
      method: "GET",
      data: {},
      callBack: function (res) {
        wx.hideLoading();
        if (res.code === "00000") {
          ths.setData({
            addressList: res.data // 更新地址列表
          });
        } else {
          wx.showToast({
            title: res.msg || '加载地址失败',
            icon: 'none'
          });
        }
      }
    };
    http.request(params);
  },

  //新增收货地址
  onAddAddr: function (e) {
    wx.navigateTo({
      url: '/pages/editAddress/editAddress',
    })
  },

// 修改地址 
  toEditAddress: function (e) {
    var addrId = e.currentTarget.dataset.addrid;
    wx.navigateTo({
      url: '/pages/editAddress/editAddress?addrId=' + addrId,
    })
  },

  /**
   * 选择地址 跳转回提交订单页
   */
  selAddrToOrder: function (e) {
    if (this.data.order == 0) {
      var pages = getCurrentPages();//当前页面
      var prevPage = pages[pages.length - 2];//上一页面
      prevPage.setData({//直接给上移页面赋值
        item: e.currentTarget.dataset.item,
        selAddress: 'yes'
      });
      wx.navigateBack({//返回
        delta: 1
      })
    }
  }
})