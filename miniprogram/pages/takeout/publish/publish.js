const { request } = require('../../../utils/request');
const PLATFORMS = ['美团', '饿了么', '其他'];

Page({
  data: {
    platforms: PLATFORMS, platformIndex: -1, selectedPlatform: '',
    pickupCode: '', pickupLocation: '', destination: '', phoneTail: '',
    gender: '', deliveryFee: 5
  },
  onPlatformChange(e) { this.setData({ platformIndex: e.detail.value, selectedPlatform: PLATFORMS[e.detail.value] }); },
  onInput(e) { this.setData({ [e.currentTarget.dataset.field]: e.detail.value }); },
  setGender(e) { this.setData({ gender: e.currentTarget.dataset.gender }); },
  setFee(e) { this.setData({ deliveryFee: parseInt(e.currentTarget.dataset.fee) }); },
  async submitOrder() {
    const { selectedPlatform, pickupCode, pickupLocation, destination, phoneTail, gender, deliveryFee } = this.data;
    if (!selectedPlatform || !pickupLocation || !destination || !phoneTail) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' }); return;
    }
    try {
      await request('/takeout', 'POST', {
        platform: selectedPlatform, pickup_location: pickupLocation, pickup_code: pickupCode,
        destination, publisher_gender: gender, phone_tail: phoneTail, delivery_fee: deliveryFee
      });
      wx.showToast({ title: '发布成功', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 1500);
    } catch (err) { wx.showToast({ title: '发布失败', icon: 'none' }); }
  }
});
