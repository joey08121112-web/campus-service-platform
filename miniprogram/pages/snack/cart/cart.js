const { request } = require('../../../utils/request');

const EMOJIS = ['🍪', '🥤', '🍫', '🍬', '🥜', '🍿', '🧁', '🍩'];

Page({
  data: {
    items: [], totalAmount: '0.00',
    dormitory: '', room: '', pickupType: 'self'
  },

  onLoad() {
    const cartItems = wx.getStorageSync('snackCartItems') || [];
    const dormitory = wx.getStorageSync('snackDormitory') || '';
    this.setData({ dormitory });
    this.loadCartItems(cartItems);
  },

  async loadCartItems(cartItems) {
    try {
      const allSnacks = await request(`/snacks?dormitory=${this.data.dormitory}`);
      let totalAmount = 0;
      const items = cartItems.map((ci, i) => {
        const product = allSnacks.find(s => s.id === ci.product_id);
        if (!product) return null;
        const subtotal = (product.price * ci.quantity).toFixed(2);
        totalAmount += parseFloat(subtotal);
        return { ...ci, name: product.name, price: product.price, subtotal, emoji: EMOJIS[i % EMOJIS.length] };
      }).filter(Boolean);
      this.setData({ items, totalAmount: totalAmount.toFixed(2) });
    } catch (err) { console.error('加载购物车失败', err); }
  },

  onInput(e) { this.setData({ [e.currentTarget.dataset.field]: e.detail.value }); },

  setPickup(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ pickupType: type });
    this.recalculate();
  },

  recalculate() {
    let total = this.data.items.reduce((sum, i) => sum + parseFloat(i.subtotal), 0);
    if (this.data.pickupType === 'delivery') total += 1;
    this.setData({ totalAmount: total.toFixed(2) });
  },

  async submitOrder() {
    const { dormitory, room, items, pickupType } = this.data;
    if (!room) { wx.showToast({ title: '请填写房间号', icon: 'none' }); return; }

    try {
      const orderItems = items.map(i => ({ product_id: i.product_id, quantity: i.quantity }));
      await request('/snack/orders', 'POST', {
        dormitory: `${dormitory} ${room}`,
        items: orderItems,
        pickup_type: pickupType
      });
      wx.showToast({ title: '下单成功', icon: 'success' });
      wx.removeStorageSync('snackCartItems');
      wx.removeStorageSync('snackDormitory');
      setTimeout(() => wx.navigateBack(), 1500);
    } catch (err) { wx.showToast({ title: '下单失败', icon: 'none' }); }
  }
});
