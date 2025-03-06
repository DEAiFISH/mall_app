var http = require('../../utils/http.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: Object,
    type: Number,
    order: Boolean,
    canUse: Boolean,
    index: Number,
    showTimeType: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    stsType: 4

  },
  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function() {
    //console.log(this.data.item);
  },
  /**
   * 组件的方法列表
   */
  methods: {
    receiveCoupon(e) {
      var voucherId = e.currentTarget.dataset.voucherid;
      console.log('voucherId', voucherId);
      http.request({
        url: `/voucher/v1/receive?voucherId=${voucherId}`,
        method: "PUT",
        callBack: (res) => {
          if (res.code === "00000") {
            wx.showToast({
              title: '领取成功',
              icon: 'success'
            });
            this.setData({
              item: res.data,
              canUse: false
            });
          } else {
            wx.showToast({
              title: res.msg || '领取失败',
              icon: 'none'
            });
          }
        }
      });
    },
    checkCoupon(e) {
      console.log(e);
    },
    /**
     * 立即使用
     */
    useCoupon() {
      var url = '/pages/prod-classify/prod-classify?sts=' + this.data.stsType;
      var id = this.data.item.couponId;
      var title = "优惠券活动商品";
      if (id) {
        url += "&tagid=" + id + "&title=" + title;
      }
      wx.navigateTo({
        url: url
      })

    }
  }
})