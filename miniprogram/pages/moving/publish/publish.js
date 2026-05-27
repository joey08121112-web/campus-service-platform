const { request } = require('../../../utils/request');

Page({
  data: {
    fromLocation: '', toLocation: '', luggageCount: 1,
    luggageDesc: '', expectTime: '',
    deliveryFee: 10, suggestedPrice: 10, feeOptions: [5, 10, 15, 20, 25]
  },
  onInput(e) { this.setData({ [e.currentTarget.dataset.field]: e.detail.value }); },
  addCount() { this.setData({ luggageCount: this.data.luggageCount + 1 }); this.updatePrice(); },
  minusCount() { if (this.data.luggageCount > 1) { this.setData({ luggageCount: this.data.luggageCount - 1 }); this.updatePrice(); } },
  setFee(e) { this.setData({ deliveryFee: parseInt(e.currentTarget.dataset.fee) }); },
  updatePrice() {
    const base = 10;
    const extra = Math.max(0, this.data.luggageCount - 2) * 5;
    this.setData({ suggestedPrice: base + extra, deliveryFee: base + extra });
  },
  async submitOrder() {
    const { fromLocation, toLocation, luggageCount, luggageDesc, expectTime, deliveryFee } = this.data;
    if (!fromLocation || !toLocation) { wx.showToast({ title: '请填写起终点', icon: 'none' }); return; }
    try {
      await request('/moving', 'POST', {
        from_location: fromLocation, to_location: toLocation,
        luggage_count: luggageCount, luggage_desc: luggageDesc,
        expect_time: expectTime, delivery_fee: deliveryFee
      });
      wx.showToast({ title: '发布成功', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 1500);
    } catch (err) { wx.showToast({ title: '发布失败', icon: 'none' }); }
  }
});
