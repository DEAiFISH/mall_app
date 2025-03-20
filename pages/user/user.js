// pages/user/user.js

var http = require("../../utils/http.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderAmount: '',
    sts: '',
    collectionCount: 0,
    historyCount: 0,
    userId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

  /**
 * 获取用户信息
 */
  getUserInfo() {
    console.log('获取用户信息 ==> ', wx.getStorageSync("userInfo").id);
    this.setData({
      userId: wx.getStorageSync("userInfo").id
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
    this.getUserInfo();
    this.showCollectionCount();
    this.showHistoryCount();
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  toCouponCenter: function() {
    wx.navigateTo({
      url: '/pages/coupon-center/coupon-center',
    })
  },

  toMyCouponPage: function() {
    wx.showToast({
      icon: "none",
      title: '该功能未开源'
    })
  },

  toAddressList: function() {
    wx.navigateTo({
      url: '/pages/delivery-address/delivery-address',
    })
  },

  // 跳转绑定手机号
  toBindingPhone: function() {
    wx.navigateTo({
      url: '/pages/binding-phone/binding-phone',
    })
  },

  /**
 * 退出登录
 */
  logout: function() {
    // 请求退出登陆接口
    http.request({
      url: '/doLogout',
      method: 'POST',
      callBack: res => {
        console.log('退出登录结果 ==> ', res);
        wx.removeStorageSync('userInfo');
        wx.removeStorageSync('token');

        // this.$Router.pushTab('/pages/index/index')
        wx.showToast({
          title: "退出成功",
          icon: "none"
        })
        
        this.setData({
          orderAmount: ''
        });
        setTimeout(() => {
          wx.switchTab({
            url: "/pages/index/index"
          })
        }, 1000)
      }
    })
  },

  toOrderListPage: function(e) {
    var sts = e.currentTarget.dataset.sts;
    wx.navigateTo({
      url: '/pages/orderList/orderList?sts=' + sts,
    })
  },
  /**
   * 查询所有的收藏量
   */
  showCollectionCount: function() {
    var ths = this;
    var params = {
      url: "/product-collect/v1/count/" + this.data.userId,
      method: "GET",
      data: {},
      callBack: function(res) {
        wx.hideLoading();
        ths.setData({
          collectionCount: res.data
        });
      }
    };
    http.request(params);
  },

  /**
   * 查询浏览历史
   */
  showHistoryCount: function() {
    var ths = this;
    var params = {
      url: "/browse-history/v1/count/" + this.data.userId,
      method: "GET",
      data: {},
      callBack: function(res) {
        wx.hideLoading();
        ths.setData({
          historyCount: res.data
        });
      }
    };
    http.request(params);
  },

  /**
   * 我的收藏跳转
   */
  myCollectionHandle: function() {
    var url = '/pages/prod-classify/prod-classify?sts=5';
    var id = 0;
    var title = "我的收藏商品";
    if (id) {
      url += "&tagid=" + id + "&title=" + title;
    }
    wx.navigateTo({
      url: url
    })
  },

  toHistoryPage: function() {
    wx.navigateTo({
      url: '/pages/history/history',
    })
  },

  navigateToUserInfo: function() {
    wx.navigateTo({
      url: '/pages/user-info/user-info',
    });
  },

})