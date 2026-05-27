# 校园综合服务平台

一站式校园生活服务微信小程序，整合校内多种高频服务场景。

## 功能模块

| 模块 | 说明 | 状态 |
|------|------|------|
| 🍜 校内订餐 | 5个餐饮区域，商家独立管理菜品 | ✅ |
| 🖨️ 打印服务 | 每栋宿舍楼一个打印点，自动计费 | ✅ |
| 🍪 零食小店 | 宿舍楼零食，支持自取或配送 | ✅ |
| 🛵 代取外卖 | 校门口到宿舍最后一公里配送 | ✅ |
| 📦 快递代取 | 按快递类型+大小自动计价 | ✅ |
| 🧳 行李搬运 | 按趟收费，适用于搬宿舍/毕业季 | ✅ |

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | 微信小程序原生 |
| 后端 | Node.js + Express |
| 数据库 | MySQL |
| 认证 | JWT |
| 文件存储 | 本地存储 |

## 项目结构

```
├── miniprogram/          # 微信小程序前端
│   ├── pages/
│   │   ├── index/        # 首页
│   │   ├── order/        # 订餐模块
│   │   ├── print/        # 打印服务
│   │   ├── snack/        # 零食小店
│   │   ├── takeout/      # 代取外卖
│   │   ├── express/      # 快递代取
│   │   ├── moving/       # 行李搬运
│   │   └── profile/      # 个人中心
│   ├── utils/            # 工具函数
│   └── app.json          # 小程序配置
│
├── server/               # Node.js 后端
│   ├── controllers/      # 控制器
│   ├── models/           # 数据模型
│   ├── routes/           # 路由
│   ├── middleware/        # 中间件
│   ├── config/           # 配置
│   └── app.js            # 入口文件
│
└── docs/                 # 文档
```

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/joey08121112-web/campus-service-platform.git
cd campus-service-platform
```

### 2. 配置后端

```bash
cd server
npm install
```

编辑 `server/.env` 文件：

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=你的MySQL密码
DB_NAME=campus_service
JWT_SECRET=你的密钥
```

### 3. 创建数据库

```sql
CREATE DATABASE campus_service DEFAULT CHARACTER SET utf8mb4;
```

### 4. 启动后端

```bash
npm run dev
```

启动后会自动创建所有数据表。

### 5. 打开小程序

用微信开发者工具打开 `miniprogram/` 目录，AppID 填入你的小程序 ID。

## API 接口

### 用户模块
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/user/login | 微信登录 |
| GET | /api/user/profile | 获取用户信息 |
| PUT | /api/user/profile | 更新用户信息 |

### 订餐模块
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/merchants | 商家列表 |
| GET | /api/merchants/:id | 商家详情 |
| GET | /api/merchants/:id/products | 菜品列表 |
| POST | /api/orders | 创建订单 |
| POST | /api/orders/:id/pay | 模拟支付 |

### 打印服务
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/print/upload | 上传文件 |
| GET | /api/print/calculate | 计算费用 |
| POST | /api/print/jobs | 创建打印任务 |

### 零食小店
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/snacks | 零食列表 |
| POST | /api/snack-orders | 创建订单 |

### 代取外卖
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/takeout | 发布代取任务 |
| GET | /api/takeout | 任务列表 |
| POST | /api/takeout/:id/accept | 接单 |

### 快递代取
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/express | 发布代取任务 |
| GET | /api/express/calculate | 计算费用 |
| POST | /api/express/:id/accept | 接单 |

### 行李搬运
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/moving | 发布搬运需求 |
| GET | /api/moving | 需求列表 |
| POST | /api/moving/:id/accept | 接单 |

## 设计风格

采用 Apple Store 设计语言：
- 白色背景 + 浅灰卡片
- 蓝色链接作为唯一强调色
- 大量留白，极简排版
- 统一灰色图标背景

## 开发阶段

| 阶段 | 内容 | 状态 |
|------|------|------|
| MVP | 订餐 + 打印 + 零食 | ✅ |
| 第二阶段 | 代取外卖 + 快递代取 + 行李搬运 | ✅ |
| 第三阶段 | 闲置出售 + 兼职平台 | ⏳ |

## License

MIT
