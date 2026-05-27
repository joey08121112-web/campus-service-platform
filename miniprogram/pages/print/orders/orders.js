const { request } = require('../../../utils/request');

const STATUS_MAP = {
  0: { text: '待付款', class: 'status-pending' },
  1: { text: '待打印', class: 'status-pending' },
  2: { text: '打印中', class: 'status-printing' },
  3: { text: '已完成', class: 'status-done' }
};

Page({
  data: { orders: [], loading: false },

  onLoad() { this.loadOrders(); },

  onShow() { this.loadOrders(); },

  async loadOrders() {
    this.setData({ loading: true });
    try {
      const orders = await request('/print/jobs');
      const enriched = orders.map(o => ({
        ...o,
        statusText: STATUS_MAP[o.status]?.text || '未知',
        statusClass: STATUS_MAP[o.status]?.class || ''
      }));
      this.setData({ orders: enriched, loading: false });
    } catch (err) {
      this.setData({ loading: false });
    }
  }
});
