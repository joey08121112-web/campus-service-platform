const { request } = require('../../../utils/request');

// 商家头像渐变色池
const AVATAR_COLORS = [
  'linear-gradient(135deg, #FF8A5C, #FF6B3D)',
  'linear-gradient(135deg, #4ECDC4, #2DB87F)',
  'linear-gradient(135deg, #FFB347, #FF8A5C)',
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4facfe, #00f2fe)'
];

// 标签样式映射
const TAG_STYLES = {
  '热销': { bg: '#FFF0EC', color: '#FF6B3D' },
  '推荐': { bg: '#E8F8F0', color: '#2DB87F' },
  '新品': { bg: '#FFF8EC', color: '#FFB347' },
  '优选': { bg: '#EEF0FF', color: '#667eea' }
};

const TAG_LIST = ['热销', '推荐', '新品', '优选'];

Page({
  data: {
    merchants: [],
    currentArea: 'all',
    loading: false
  },

  onLoad() {
    this.loadMerchants();
  },

  async loadMerchants() {
    this.setData({ loading: true });
    try {
      const url = this.data.currentArea === 'all'
        ? '/merchants'
        : `/merchants?area=${this.data.currentArea}`;
      const merchants = await request(url);

      // 为每个商家添加展示数据
      const enriched = merchants.map((m, i) => ({
        ...m,
        avatarBg: AVATAR_COLORS[i % AVATAR_COLORS.length],
        tag: TAG_LIST[i % TAG_LIST.length],
        tagBg: TAG_STYLES[TAG_LIST[i % TAG_LIST.length]].bg,
        tagColor: TAG_STYLES[TAG_LIST[i % TAG_LIST.length]].color,
        sales: Math.floor(Math.random() * 500 + 50)
      }));

      this.setData({ merchants: enriched, loading: false });
    } catch (err) {
      console.error('加载商家列表失败', err);
      this.setData({ loading: false });
    }
  },

  switchArea(e) {
    const area = e.currentTarget.dataset.area;
    if (area === this.data.currentArea) return;
    this.setData({ currentArea: area });
    this.loadMerchants();
  },

  goToMenu(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/order/menu/menu?id=${id}`
    });
  }
});
