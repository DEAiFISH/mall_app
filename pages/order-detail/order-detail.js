// pages/order-detail/order-detail.js

var http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderItemDtos: [],
    userAddrDto: null,
    orderNumber: "",
    createTime: "",
    productTotalAmount: '',
    shopId: '',
    prodid: '',
    memo: '',
    money: '',
    amount: '',
    number: '',
    paymentMethod: '',
    createTime: '',
    status: '',
    address: '',
    cancelReason: '',
    cancelTime: '',
    failureReason: '',
    failureTime: '',
    evaluationContent: '', // 评价内容
    starRating: 3, // 默认星级
    isPay: false,
    payTime: '',
    shipTime: '',
    finishTime: '',
    courierNumber: '',
    uId: '',
    prodId: ''
  },

  //跳转商品详情页
  toProdPage: function(e) {
    var prodid = e.currentTarget.dataset.prodid;
    wx.navigateTo({
      url: '/pages/prod/prod?prodid=' + prodid,
    })
  },

  /**
   * 加入购物车
   */
  addToCart: function(event) {
    let index = event.currentTarget.dataset.index
    // if (!this.orderItemDtos) {
    //   console.log(1213)
    //   return;
    // }
    var ths = this;
    wx.showLoading({
      mask: true
    });
    var params = {
      url: "/p/shopCart/changeItem",
      method: "POST",
      data: {
        basketId: 0,
        count: this.data.orderItemDtos[index].prodCount,
        prodId: this.data.orderItemDtos[index].prodId,
        shopId: this.data.shopId,
        skuId: this.data.orderItemDtos[index].skuId
      },
      callBack: function(res) {
        //console.log(res);
        wx.hideLoading();
        wx.showToast({
          title: "加入购物车成功",
          icon: "none"
        })
        wx.switchTab({
          url: '/pages/basket/basket',
        })
      }
    };
    http.request(params);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadOrderDetail(options.orderNum);
    this.getUserInfo();
  },

  /**
   * 加载订单数据
   */
  loadOrderDetail: function(orderNum) {
    var ths = this;
    wx.showLoading();
    //加载订单详情
    var params = {
      url: `/order/v1/get/order/${orderNum}`,
      method: "GET",
      callBack: function(res) {
        if (res.code === "00000") {
          ths.setData({
            orderNumber: orderNum,
            money: res.data.money,
            amount: res.data.amount,
            createTime: res.data.createTime,
            number: res.data.number,
            paymentMethod: res.data.paymentMethod,
            status: res.data.status,
            address: res.data.address,
            memo: res.data.memo,
            cancelReason: res.data.cancelReason || '',
            cancelTime: res.data.cancelTime || '',
            failureReason: res.data.failureReason || '',
            failureTime: res.data.failureTime || '',
            isPay: res.data.isPay || false,
            payTime: res.data.payTime || '',
            shipTime: res.data.shipTime || '',
            finishTime: res.data.finishTime || '',
            expressNumber: res.data.courierNumber || '',
            prodId: res.data.productId || ''
          });
        } else {
          wx.showToast({
            title: res.msg || '加载订单详情失败',
            icon: 'none'
          });
        }
        wx.hideLoading();
      }
    };
    http.request(params);
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
   * 取消订单
   */
  onCancelOrder: function(e) {
    var ths = this;
    wx.showModal({
      title: '确认取消订单',
      content: '您确定要取消此订单吗？',
      confirmColor: "#eb2444",
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            mask: true
          });
          var params = {
            url: `/order/v1/cancel/${ths.data.orderNumber}?cancelReason=2`, 
            method: "PUT",
            callBack: function(res) {
              if (res.code === "00000") {
                wx.showToast({
                  title: '订单已取消',
                  icon: 'success'
                });
                ths.loadOrderDetail(ths.data.orderNumber); // 重新加载订单详情
              } else {
                wx.showToast({
                  title: res.msg || '取消订单失败',
                  icon: 'none'
                });
              }
              wx.hideLoading();
            }
          };
          http.request(params);
        }
      }
    });
  },

  /**
   * 支付订单
   */
  onPayOrder: function(e) {
    var ths = this;
    wx.showModal({
      title: '确认支付订单',
      content: '您确定要支付此订单吗？',
      confirmColor: "#eb2444",
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            mask: true
          });
          var params = {
            url: `/pay/v1/pay?orderId=${ths.data.orderNumber}`, // 支付订单的接口
            method: "PUT",
            callBack: function(res) {
              if (res.code === "00000") {
                wx.showToast({
                  title: '支付成功',
                  icon: 'success'
                });
                ths.loadOrderDetail(ths.data.orderNumber); // 重新加载订单详情
              } else {
                wx.showToast({
                  title: res.msg || '支付失败',
                  icon: 'none'
                });
              }
              wx.hideLoading();
            }
          };
          http.request(params);
        }
      }
    });
  },

  /**
   * 删除订单
   */
  onDeleteOrder: function(e) {
    var ths = this;
    wx.showModal({
      title: '确认删除订单',
      content: '您确定要删除此订单吗？',
      confirmColor: "#eb2444",
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            mask: true
          });
          var params = {
            url: `/order/v1/delete/${ths.data.orderNumber}`, // 删除订单的接口
            method: "DELETE",
            callBack: function(res) {
              if (res.code === "00000") {
                wx.showToast({
                  title: '订单已删除',
                  icon: 'success'
                });
                wx.navigateBack(); // 返回上一页
              } else {
                wx.showToast({
                  title: res.msg || '删除订单失败',
                  icon: 'none'
                });
              }
              wx.hideLoading();
            }
          };
          http.request(params);
        }
      }
    });
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 评价订单
   */
  onEvaluate: function(e) {
    var ths = this;
    console.log('prodId',ths.data.prodId);
    console.log('uId',ths.data.uId);

    wx.showModal({
      title: '评价商品',
      content: '',
      editable: true,
      confirmColor: "#eb2444",
      success(res) {
        if (res.confirm) {
          wx.showActionSheet({
            itemList: ['1分', '2分', '3分', '4分', '5分'],
            success: function(sheetRes) {
              var selectedRating = sheetRes.tapIndex + 1;
              wx.showModal({
                title: '是否匿名',
                content: '您希望匿名评价吗？',
                confirmText: '是',
                cancelText: '否',
                success: function(anonRes) {
                  var isAnonymous = anonRes.confirm;
                  wx.showLoading({
                    mask: true
                  });
                  var params = {
                    url: '/product-evaluation/v1/add', // 评价商品的接口
                    method: "POST",
                    data: {
                      evaluationId: null,
                      productId: ths.data.prodId,
                      userId: ths.data.uId,
                      orderId: ths.data.orderNumber,
                      content: res.content,
                      reply: null,
                      isReply: false,
                      star: selectedRating, 
                      picture: null,
                      isAnonymous: isAnonymous
                    },
                    callBack: function(res) {
                      if (res.code === "00000") {
                        wx.showToast({
                          title: '评价成功',
                          icon: 'success'
                        });
                      } else {
                        wx.showToast({
                          title: res.msg || '评价失败',
                          icon: 'none'
                        });
                      }
                      wx.hideLoading();
                    }
                  };
                  http.request(params);
                }
              });
            },
            fail: function() {
              wx.showToast({
                title: '评分取消',
                icon: 'none'
              });
            }
          });
        }
      }
    });
  },

  /**
   * 收货
   */
  onReceive: function(e) {
    var ths = this;
    wx.showModal({
      title: '确认收货',
      content: '您确定已收到货物吗？',
      confirmColor: "#eb2444",
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            mask: true
          });
          var params = {
            url: `/order/v1/receive/${ths.data.orderNumber}`, // 收货的接口
            method: "PUT",
            callBack: function(res) {
              if (res.code === "00000") {
                wx.showToast({
                  title: '收货成功',
                  icon: 'success'
                });
                ths.loadOrderDetail(ths.data.orderNumber); // 重新加载订单详情
              } else {
                wx.showToast({
                  title: res.msg || '收货失败',
                  icon: 'none'
                });
              }
              wx.hideLoading();
            }
          };
          http.request(params);
        }
      }
    });
  },
  // 一键复制事件
  copyBtn: function(e) {
    var ths = this;
    wx.setClipboardData({
      //准备复制的数据
      data: ths.data.orderNumber,
      success: function(res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    })
  },
})