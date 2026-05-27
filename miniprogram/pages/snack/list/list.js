const { request } = require('../../../utils/request');

const DORMITORIES = ['1号楼', '2号楼', '3号楼', '4号楼', '5号楼', '6号楼', '7号楼', '8号楼', '9号楼', '10号楼'];
const IMG_COLORS = [
  'linear-gradient(135deg, #FFE8D6, #FFD4B8)',
  'linear-gradient(135deg, #D4F5E9, #B8EDD8)',
  'linear-gradient(135deg, #FFF3E0, #FFE0B2)',
  'linear-gradient(135deg, #E3F2FD, #BBDEFB)'
];
const EMOJIS = ['🍪', '🥤', '🍫', '🍬', '🥜', '🍿', '🧁', '🍩'];

Page({
  data: {
    dormitories: DORMITORIES,
    dormIndex: -1,
    selectedDorm: '',
    snacks: [],
    cart: {},
    totalCount: 0,
    totalAmount: '0.00',
    loading: false
  },

  onDormChange(e) {
    const idx = e.detail.value;
    this.setData({ dormIndex: idx, selectedDorm: DORMITORIES[idx] });
    this.loadSnacks();
  },

  async loadSnacks() {
    this.setData({ loading: true });
    try {
      const snacks = await request(`/snacks?dormitory=${this.data.selectedDorm}`);
      const enriched = snacks.map((s, i) => ({
        ...s,
        imgBg: IMG_COLORS[i % IMG_COLORS.length],
        emoji: EMOJIS[i % EMOJIS.length],
        quantity: this.data.cart[s.id] || 0
      }));
      this.setData({ snacks: enriched, loading: false });
    } catch (err) {
      this.setData({ loading: false });
    }
  },

  addToCart(e) {
    const id = e.currentTarget.dataset.id;
    const cart = { ...this.data.cart };
    cart[id] = (cart[id] || 0) + 1;
    this.updateCart(cart);
  },

  minusFromCart(e) {
    const id = e.currentTarget.dataset.id;
    const cart = { ...this.data.cart };
    if (cart[id] > 0) { cart[id]--; if (cart[id] === 0) delete cart[id]; }
    this.updateCart(cart);
  },

  updateCart(cart) {
    let totalCount = 0, totalAmount = 0;
    const snacks = this.data.snacks.map(s => {
      const quantity = cart[s.id] || 0;
      totalCount += quantity;
      totalAmount += quantity * parseFloat(s.price);
      return { ...s, quantity };
    });
    this.setData({ cart, snacks, totalCount, totalAmount: totalAmount.toFixed(2) });
  },

  goToCart() {
    const items = [];
    for (const [productId, quantity] of Object.entries(this.data.cart)) {
      if (quantity > 0) items.push({ product_id: parseInt(productId), quantity });
    }
    wx.setStorageSync('snackCartItems', items);
    wx.setStorageSync('snackDormitory', this.data.selectedDorm);
    wx.navigateTo({ url: '/pages/snack/cart/cart' });
  }
});
