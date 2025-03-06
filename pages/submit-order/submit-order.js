// pages/submit-order/submit-order.js
var http = require("../../utils/http.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    popupShow: false,
    couponSts: 1,
    couponList: [],
    // 订单入口 0购物车 1立即购买
    orderEntry: "0",
    userAddr: null,
    orderItems: [],
    coupon: {
      totalLength: 0,
      canUseCoupons: [],
      noCanUseCoupons: []
    },
    actualTotal: 0,
    total: 0,
    totalCount: 0,
    transfee: 0,
    reduceAmount: 0,
    remark: "",
    couponIds: [],
    prodId: "",
    prodCount: "",
    prodPrice: "",
    preferentialPrice: "",
    prodName: "",
    couponIds: [],
    price: 0,
    memos: "",
    uId: "",
    orderId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      prodId: options.prodId,
      prodCount: options.prodCount,
      prodPrice: options.prodPrice,
      preferentialPrice: options.preferentialPrice,
      prodName: options.prodName,
      pic: options.pic,
      price: options.price
    });
    this.getUserInfo();
  },

  //加载订单数据
  loadOrderData: function() {
    this.setData({
      orderItems: [{
        prodId: this.data.prodId,
        prodCount: this.data.prodCount,
        prodPrice: this.data.prodPrice,
        preferentialPrice: this.data.preferentialPrice,
        prodName: this.data.prodName,
        pic: this.data.pic,
        price: this.data.price
      }]
    });
  },

  /**
   * 优惠券选择出错处理方法
   */
  chooseCouponErrHandle(res) {
    // 优惠券不能共用处理方法
    if (res.statusCode == 601) {
      wx.showToast({
        title: res.data,
        icon: "none",
        duration: 3000,
        success: res => {
          this.setData({
            couponIds: []
          })
        }
      })
      setTimeout(() => {
        this.loadOrderData();
      }, 2500)
    }
  },

  onRemarksInput: function (e) {
    this.setData({
      memos: e.detail.value
    });
  },

  /**
   * 提交订单
   */
  toPay: function() {
    if (!this.data.userAddr) {
      wx.showToast({
        title: '请选择地址',
        icon: "none"
      })
      return;
    }

    this.submitOrder();
  },


  /**
   * 获取用户信息
   */
  getUserInfo() {
    this.setData({
      uId: wx.getStorageSync("userInfo").id
    })
  },

  /**
   * 提交订单
   */
  submitOrder: function() {
    wx.showLoading({
      mask: true
    });

    console.log(this.data.uId);
    console.log(this.data.userAddr.addressId);


    var params = {
      url: "/order/v1/add",
      method: "POST",
      data: {
        orderId: null,
        userId: this.data.uId,
        productId: this.data.prodId,
        parameter: null,
        number: "订单流水号：" + new Date().getTime(),
        paymentMethod: null,
        memo: this.data.memos,
        status: null,
        addressId: this.data.userAddr ? this.data.userAddr.addressId : null,
        courierNumber: null,
        amount: this.data.prodCount,
        payTime: null,
        shipTime: null,
        finishTime: null,
        cancelTime: null,
        isPay: false,
        isDelete: 0,
        cancelReason: null
      },
      callBack: res => {
        wx.hideLoading();
        if (res.code === "00000") {
          wx.showToast({
            title: '订单提交成功',
            icon: 'success'
          });
          
          this.setData({
            orderId: res.data.orderId
          });
          console.log("订单ID：",this.data.orderId);
          wx.navigateTo({
            url: '/pages/order-detail/order-detail?orderNum=' + this.data.orderId
          });
        } else {
          wx.showToast({
            title: res.msg || '订单提交失败',
            icon: 'none'
          });
        }
      }
    };
    http.request(params);
  },

  /**
   * 唤起微信支付
   */
  calWeixinPay: function(orderNumbers) {
    wx.showLoading({
      mask: true
    });
    var params = {
      url: "/p/order/pay",
      method: "POST",
      data: {
        payType: 1,
        orderNumbers: orderNumbers
      },
      callBack: function(res) {
        wx.hideLoading();
        wx.requestPayment({
          timeStamp: res.timeStamp,
          nonceStr: res.nonceStr,
          package: res.packageValue,
          signType: res.signType,
          paySign: res.paySign,
          success: e => {
            // console.log("支付成功");
            wx.navigateTo({
              url: '/pages/pay-result/pay-result?sts=1&orderNumbers=' + orderNumbers + "&orderType=" + this.data.orderType,
            })
          },
          fail: err => {
            wx.navigateTo({
              url: '/pages/pay-result/pay-result?sts=0&orderNumbers=' + orderNumbers + "&orderType=" + this.data.orderType,
            })
          }
        })

      }
    };
    http.request(params);
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
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];
    if (currPage.data.selAddress == "yes") {
      this.setData({ //将携带的参数赋值
        userAddr: currPage.data.item
      });
    }
    //获取订单数据
    this.loadOrderData();
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

  changeCouponSts: function(e) {
    this.setData({
      couponSts: e.currentTarget.dataset.sts
    });
  },

  showCouponPopup: function() {
    this.setData({
      popupShow: true
    });
  },

  closePopup: function() {
    this.setData({
      popupShow: false
    });
  },

  /**
   * 去地址页面
   */
  toAddrListPage: function() {
    wx.navigateTo({
      url: '/pages/delivery-address/delivery-address?order=0',
    })
  },
  /**
   * 确定选择好的优惠券
   */
  choosedCoupon: function() {
    this.loadOrderData();
    this.setData({
      popupShow: false
    });
  },

  /**
   * 优惠券子组件发过来
   */
  checkCoupon: function(e) {
    var ths = this;
    let index = ths.data.couponIds.indexOf(e.detail.couponId);
    if (index === -1) {
      ths.data.couponIds.push(e.detail.couponId)
    } else {
      ths.data.couponIds.splice(index, 1)
    }
  }
})