// pages/editAddress/editAddress.js
var http = require("../../utils/http.js");
var config = require("../../utils/config.js");
var index = [18, 0, 0];

var t = 0;
var show = false;
var moveY = 200;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: [0, 0, 0],
    provArray: [],
    cityArray: [],
    areaArray: [],
    province: "",
    city: "",
    area: "",
    street: "",
    provinceId: 0,
    cityId: 0,
    areaId: 0,
    receiver: "",
    mobile: "",
    addr: "",
    addrId: 0
  },

  /**
* 生命周期函数--监听页面显示
*/
  onShow: function () {

  },

 
  onReady: function () {
    this.animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 0,
      timingFunction: "ease",
      delay: 0
    }
    )
    this.animation.translateY(200 + 'vh').step();
    this.setData({
      animation: this.animation.export(),
      show: show
    })
  },
  //移动按钮点击事件
  translate: function (e) {
    if (t == 0) {
      moveY = 0;
      show = false;
      t = 1;
    } else {
      moveY = 200;
      show = true;
      t = 0;
    }
    this.setData({
      show: true
    });
    // this.animation.translate(arr[0], arr[1]).step();
    this.animationEvents(this, moveY, show);

  },
  //隐藏弹窗浮层
  hiddenFloatView(e) {
    //console.log(e);
    moveY = 200;
    show = true;
    t = 0;
    this.animationEvents(this, moveY, show);

  },

  //动画事件
  animationEvents: function (that, moveY, show) {
    //console.log("moveY:" + moveY + "\nshow:" + show);
    that.animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 400,
      timingFunction: "ease",
      delay: 0
    }
    )
    that.animation.translateY(moveY + 'vh').step()

    that.setData({
      animation: that.animation.export()
    })

  },

  bindRegionChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },

  onLoad: function (options) {
    if (options.addrId) {
      wx.showLoading();
      var params = {
        url: "/shipping-address/v1/get/" + options.addrId,
        method: "GET",
        data: {},
        callBack: res => {
          if (res.code === "00000") {
            this.setData({
              province: res.data.province,
              city: res.data.city,
              area: res.data.area,
              street: res.data.street,
              receiver: res.data.name,
              mobile: res.data.phone,
              addr: res.data.full,
              addrId: res.data.addressId
            });
          } else {
            wx.showToast({
              title: res.msg || '加载地址失败',
              icon: 'none'
            });
          }
          wx.hideLoading();
        }
      }
      http.request(params);
    }
  },

  /**
   * 保存地址
   */
  onSaveAddr: function () {
    var ths = this;
    var receiver = ths.data.receiver;
    var mobile = ths.data.mobile;
    var addr = ths.data.addr;
    var province = ths.data.province;
    var city = ths.data.city;
    var area = ths.data.area;
    var street = ths.data.street;

    if (!receiver) {
      wx.showToast({
        title: '请输入收货人姓名',
        icon: "none"
      });
      return;
    }
    if (!mobile) {
      wx.showToast({
        title: '请输入手机号码',
        icon: "none"
      });
      return;
    }
    var regexp = /^[1]([3-9])[0-9]{9}$/;
    if (!regexp.test(mobile)) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: "none"
      });
      return;
    }
    if (!addr) {
      wx.showToast({
        title: '请输入详细地址',
        icon: "none"
      });
      return;
    }
    if (!province || !city || !area || !street) {
      wx.showToast({
        title: '请输入完整的地址信息',
        icon: "none"
      });
      return;
    }

    wx.showLoading();
    var url, method;
    var data = {
      userId: wx.getStorageSync("userInfo").id,
      name: ths.data.receiver,
      phone: ths.data.mobile,
      full: ths.data.addr,
      province: ths.data.province,
      city: ths.data.city,
      area: ths.data.area,
      street: ths.data.street
    }
    if (ths.data.addrId) {
      url = "/shipping-address/v1/update";
      method = "PUT";
      data.addressId = ths.data.addrId;
    } else {
      url = "/shipping-address/v1/add";
      method = "POST";
    }

    var params = {
      url: url,
      method: method,
      data: data,
      callBack: function (res) {
        wx.hideLoading();
        if (res.code === "00000") {
          wx.showToast({
            title: ths.data.addrId ? '修改成功' : '添加成功',
            icon: 'success'
          });
          wx.navigateBack({
            delta: 1
          });
        } else {
          wx.showToast({
            title: res.msg || (ths.data.addrId ? '修改失败' : '添加失败'),
            icon: 'none'
          });
        }
      }
    };
    http.request(params);
  },

  onReceiverInput: function (e) {
    this.setData({
      receiver: e.detail.value
    });
  },

  onMobileInput: function (e) {
    this.setData({
      mobile: e.detail.value
    });
  },

  onProvinceInput: function (e) {
    this.setData({
      province: e.detail.value
    });
  },

  onCityInput: function (e) {
    this.setData({  
      city: e.detail.value
    });
  },

  onAreaInput: function (e) {
    this.setData({
      area: e.detail.value
    });
  },

  onAddrInput: function (e) {
    this.setData({
      addr: e.detail.value
    });
  },

  onStreetInput: function (e) {
    this.setData({
      street: e.detail.value
    });
  },

  //删除配送地址
  onDeleteAddr: function (e) {
    var ths = this;
    wx.showModal({
      title: '',
      content: '确定要删除此收货地址吗？',
      confirmColor: "#eb2444",
      success(res) {
        if (res.confirm) {
          var addrId = ths.data.addrId;
        
          wx.showLoading();
          var params = {
            url: "/shipping-address/v1/delete/" + addrId,
            method: "DELETE",
            data: {},
            callBack: function (res) {
              wx.hideLoading();
              wx.navigateBack({
                delta: 1
              })
            }
          }
          http.request(params);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },

})