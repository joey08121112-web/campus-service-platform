const { request } = require('../../utils/request');

Page({
  data: {
    userInfo: {}
  },

  onLoad() {
    this.loadUserInfo();
  },

  onShow() {
    this.loadUserInfo();
  },

  async loadUserInfo() {
    const token = wx.getStorageSync('token');
    if (!token) return;

    try {
      const user = await request('/user/profile');
      this.setData({ userInfo: user });
    } catch (err) {
      console.error('加载用户信息失败', err);
    }
  },

  goToEdit() {
    wx.navigateTo({ url: '/pages/profile/edit/edit' });
  },

  goToOrders() {
    // TODO: 跳转到订餐订单列表
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  goToPrintOrders() {
    wx.navigateTo({ url: '/pages/print/orders/orders' });
  },

  goToSnackOrders() {
    // TODO: 跳转到零食订单列表
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  logout() {
    wx.showModal({
      title: '提示',
      content: '确定退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('token');
          this.setData({ userInfo: {} });
          wx.showToast({ title: '已退出', icon: 'success' });
        }
      }
    });
  }
});
