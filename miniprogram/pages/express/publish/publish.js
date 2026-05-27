const { request } = require('../../../utils/request');
const EXPRESS_TYPES = ['中通', '京东', '顺丰', '其他'];
const PRICES = { '中通': { small: 5, medium: 6, large: 8 }, '京东': { small: 3, medium: 4, large: 5 }, '顺丰': { small: 3, medium: 4, large: 5 }, '其他': { small: 2, medium: 3, large: 4 } };

Page({
  data: {
    expressTypes: EXPRESS_TYPES, typeIndex: -1, selectedType: '',
    trackingNo: '', packageSize: '', destination: '', phoneTail: '',
    deliveryFee: 3, suggestedPrice: 0, feeOptions: [2, 3, 5, 8]
  },
  onTypeChange(e) {
    const idx = e.detail.value;
    this.setData({ typeIndex: idx, selectedType: EXPRESS_TYPES[idx] });
    this.updateSuggestedPrice();
  },
  onInput(e) { this.setData({ [e.currentTarget.dataset.field]: e.detail.value }); },
  setSize(e) { this.setData({ packageSize: e.currentTarget.dataset.size }); this.updateSuggestedPrice(); },
  setFee(e) { this.setData({ deliveryFee: parseInt(e.currentTarget.dataset.fee) }); },
  updateSuggestedPrice() {
    const { selectedType, packageSize } = this.data;
    if (selectedType && packageSize) {
      const price = PRICES[selectedType]?.[packageSize] || 3;
      this.setData({ suggestedPrice: price, deliveryFee: price });
    }
  },
  async submitOrder() {
    const { selectedType, trackingNo, packageSize, destination, phoneTail, deliveryFee } = this.data;
    if (!selectedType || !trackingNo || !packageSize || !destination || !phoneTail) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' }); return;
    }
    try {
      await request('/express', 'POST', {
        express_type: selectedType, tracking_no: trackingNo, package_size: packageSize,
        destination, phone_tail: phoneTail, delivery_fee: deliveryFee
      });
      wx.showToast({ title: '发布成功', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 1500);
    } catch (err) { wx.showToast({ title: '发布失败', icon: 'none' }); }
  }
});
