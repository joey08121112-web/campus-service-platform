Page({
  goToOrder() {
    wx.navigateTo({ url: '/pages/order/list/list' });
  },
  goToPrint() {
    wx.navigateTo({ url: '/pages/print/upload/upload' });
  },
  goToSnack() {
    wx.navigateTo({ url: '/pages/snack/list/list' });
  },
  goToTakeout() {
    wx.navigateTo({ url: '/pages/takeout/list/list' });
  },
  goToExpress() {
    wx.navigateTo({ url: '/pages/express/list/list' });
  },
  goToMoving() {
    wx.navigateTo({ url: '/pages/moving/list/list' });
  },
  goToIdle() {
    wx.navigateTo({ url: '/pages/idle/list/list' });
  },
  goToParttime() {
    wx.navigateTo({ url: '/pages/parttime/list/list' });
  },
  goToMerchant() {
    wx.navigateTo({ url: '/pages/merchant/login/login' });
  }
});
