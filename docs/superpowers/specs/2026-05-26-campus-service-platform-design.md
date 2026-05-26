# 校园综合服务平台 MVP 设计文档

版本：V1.0 | 日期：2026年5月26日

## 1. 项目概述

### 1.1 项目目标
开发一款面向在校大学生的综合校园服务平台（微信小程序），整合校内多种高频服务场景，提升学生校园生活便利度。

### 1.2 MVP 范围
- **订餐模块**：校内5个餐饮区域，商家独立管理菜品，学生下单配送
- **打印服务**：每栋宿舍楼一个打印点，上传文件自动计费
- **零食小店**：每栋宿舍楼运营，支持自取或配送

### 1.3 目标用户
- 普通学生（消费者）：浏览商品、下单购买、查看订单
- 商家/食堂（供应方）：管理菜品、处理订单
- 宿舍楼管理员：管理打印服务、管理零食小店
- 平台管理员：审核内容、管理定价、维护系统

## 2. 技术架构

### 2.1 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端 | 微信小程序原生 | WXML + WXSS + JS |
| 后端 | Node.js + Express | RESTful API |
| 数据库 | MySQL | 关系型数据 |
| 文件存储 | 本地存储 | uploads/ 目录 |
| 支付 | 模拟支付 | MVP 阶段 |

### 2.2 架构模式
**前后端分离架构**

- 前端：微信小程序原生代码，调用后端 API
- 后端：Node.js + Express 提供 RESTful API
- 数据库：MySQL 存储业务数据
- 文件：本地存储图片和打印文件

### 2.3 项目目录结构

```
校园综合服务/
├── miniprogram/              # 前端小程序
│   ├── pages/
│   │   ├── index/            # 首页
│   │   ├── order/            # 订餐模块
│   │   │   ├── list/         # 商家列表
│   │   │   ├── menu/         # 菜品菜单
│   │   │   └── cart/         # 购物车
│   │   ├── print/            # 打印服务
│   │   │   ├── upload/       # 上传文件
│   │   │   └── orders/       # 打印订单
│   │   ├── snack/            # 零食小店
│   │   │   ├── list/         # 零食列表
│   │   │   └── cart/         # 购物车
│   │   └── profile/          # 个人中心
│   ├── components/           # 公共组件
│   ├── utils/                # 工具函数
│   └── app.json              # 小程序配置
│
├── server/                   # 后端服务
│   ├── controllers/          # 控制器
│   ├── models/               # 数据模型
│   ├── routes/               # 路由
│   ├── middleware/            # 中间件
│   ├── config/               # 配置
│   ├── uploads/              # 文件存储
│   ├── app.js                # 入口文件
│   └── package.json
│
└── docs/                     # 文档
```

## 3. 数据库设计

### 3.1 ER 关系图

```
users (1) ──→ (N) orders
orders (1) ──→ (N) order_items
products (1) ──→ (N) order_items
merchants (1) ──→ (N) products
merchants (1) ──→ (N) orders
users (1) ──→ (N) print_jobs
users (1) ──→ (N) snack_orders
snack_orders (1) ──→ (N) snack_order_items
snack_products (1) ──→ (N) snack_order_items
```

### 3.2 核心表结构

#### users 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| openid | VARCHAR(100) | 微信openid |
| name | VARCHAR(50) | 姓名 |
| phone | VARCHAR(20) | 手机号 |
| student_id | VARCHAR(20) | 学号 |
| dormitory | VARCHAR(50) | 宿舍楼 |
| room | VARCHAR(20) | 房间号 |
| created_at | DATETIME | 创建时间 |

#### merchants 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| name | VARCHAR(100) | 商家名称 |
| area | VARCHAR(50) | 所属区域（一食堂/二食堂/南商业街/北商业街/生活超市） |
| image | VARCHAR(255) | 商家图片 |
| status | TINYINT | 0关闭/1营业 |
| created_at | DATETIME | 创建时间 |

#### products 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| merchant_id | INT | 商家ID |
| name | VARCHAR(100) | 菜品名称 |
| description | TEXT | 描述 |
| price | DECIMAL(10,2) | 价格 |
| image | VARCHAR(255) | 图片路径 |
| category | VARCHAR(50) | 分类标签 |
| stock | INT | 库存数量 |
| status | TINYINT | 0下架/1上架 |
| created_at | DATETIME | 创建时间 |

#### orders 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| order_no | VARCHAR(50) | 订单号 |
| user_id | INT | 用户ID |
| merchant_id | INT | 商家ID |
| total_amount | DECIMAL(10,2) | 总金额 |
| status | TINYINT | 0待付款/1待接单/2备餐中/3配送中/4已完成/5已取消 |
| address | VARCHAR(255) | 配送地址 |
| phone | VARCHAR(20) | 联系电话 |
| remark | TEXT | 备注 |
| created_at | DATETIME | 创建时间 |

#### order_items 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| order_id | INT | 订单ID |
| product_id | INT | 菜品ID |
| product_name | VARCHAR(100) | 菜品名称（冗余） |
| product_price | DECIMAL(10,2) | 单价（冗余） |
| quantity | INT | 数量 |

#### print_jobs 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| user_id | INT | 用户ID |
| dormitory | VARCHAR(50) | 宿舍楼 |
| file_path | VARCHAR(255) | 文件路径 |
| file_name | VARCHAR(255) | 文件名 |
| pages | INT | 页数 |
| color_mode | VARCHAR(20) | 黑白/彩印 |
| duplex | TINYINT | 0单面/1双面 |
| amount | DECIMAL(10,2) | 费用 |
| pickup_type | VARCHAR(20) | 自取/配送 |
| status | TINYINT | 0待付款/1待打印/2打印中/3已完成 |
| created_at | DATETIME | 创建时间 |

#### snack_products 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| dormitory | VARCHAR(50) | 宿舍楼 |
| name | VARCHAR(100) | 零食名称 |
| description | TEXT | 描述 |
| price | DECIMAL(10,2) | 价格 |
| image | VARCHAR(255) | 图片路径 |
| stock | INT | 库存数量 |
| status | TINYINT | 0下架/1上架 |
| created_at | DATETIME | 创建时间 |

#### snack_orders 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| order_no | VARCHAR(50) | 订单号 |
| user_id | INT | 用户ID |
| dormitory | VARCHAR(50) | 宿舍楼 |
| total_amount | DECIMAL(10,2) | 总金额 |
| pickup_type | VARCHAR(20) | 自取/配送 |
| status | TINYINT | 0待付款/1待取货/2已完成/3已取消 |
| created_at | DATETIME | 创建时间 |

#### snack_order_items 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| order_id | INT | 订单ID |
| product_id | INT | 零食ID |
| product_name | VARCHAR(100) | 零食名称（冗余） |
| product_price | DECIMAL(10,2) | 单价（冗余） |
| quantity | INT | 数量 |

## 4. API 设计

### 4.1 基础信息

- **Base URL**: `http://localhost:3000/api`
- **认证方式**: JWT Token（微信登录后获取）
- **响应格式**: JSON

**成功响应格式：**
```json
{
  "code": 200,
  "data": {...},
  "message": "success"
}
```

**错误响应格式：**
```json
{
  "code": 400,
  "data": null,
  "message": "错误信息"
}
```

### 4.2 用户模块 API

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/user/login | 微信登录 |
| GET | /api/user/profile | 获取用户信息 |
| PUT | /api/user/profile | 更新用户信息 |
| GET | /api/user/orders | 获取用户订单列表 |

### 4.3 订餐模块 API

#### 商家/菜品接口
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/merchants | 商家列表（支持按区域筛选） |
| GET | /api/merchants/:id | 商家详情 |
| GET | /api/merchants/:id/products | 菜品列表 |
| GET | /api/products/:id | 菜品详情 |

#### 订单接口
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/orders | 创建订单 |
| GET | /api/orders/:id | 订单详情 |
| PUT | /api/orders/:id/status | 更新订单状态 |
| POST | /api/orders/:id/pay | 模拟支付 |

### 4.4 打印服务 API

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/print/upload | 上传打印文件 |
| GET | /api/print/calculate | 计算打印费用 |
| POST | /api/print/jobs | 创建打印任务 |
| GET | /api/print/jobs | 打印任务列表 |
| GET | /api/print/jobs/:id | 打印任务详情 |
| PUT | /api/print/jobs/:id/status | 更新任务状态 |

### 4.5 零食小店 API

#### 商品接口
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/snacks | 零食列表（按宿舍楼筛选） |
| GET | /api/snacks/:id | 零食详情 |

#### 订单接口
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/snack-orders | 创建零食订单 |
| GET | /api/snack-orders | 零食订单列表 |
| GET | /api/snack-orders/:id | 订单详情 |
| POST | /api/snack-orders/:id/pay | 模拟支付 |

### 4.6 文件上传接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/upload/image | 上传图片 |
| POST | /api/upload/file | 上传文件（打印用） |

**响应格式：**
```json
{
  "code": 200,
  "data": {
    "url": "/uploads/xxx.jpg"
  }
}
```

## 5. 业务流程

### 5.1 订餐流程

1. 学生浏览商家列表（按区域分类）
2. 进入商家页面查看菜品
3. 加入购物车（每个商家独立购物车）
4. 提交订单（填写地址、手机号、学号）
5. 模拟支付
6. 商家接单、备餐
7. 商家或配送员配送到宿舍
8. 学生确认完成

### 5.2 打印流程

1. 学生选择所在宿舍楼的打印点
2. 上传打印文件（PDF/Word/图片）
3. 系统自动识别页数
4. 选择打印参数（黑白/彩印、单面/双面）
5. 系统计算费用
6. 模拟支付
7. 管理员打印
8. 学生自取或配送到房间

### 5.3 零食购买流程

1. 学生浏览本楼零食列表
2. 加入购物车
3. 选择取货方式（自取/配送）
4. 提交订单
5. 模拟支付
6. 管理员备货
7. 学生自取或配送到房间

## 6. 打印定价规则

| 打印类型 | 单价（每页） | 备注 |
|----------|--------------|------|
| 黑白单面 | 0.3 元 | 最常用 |
| 黑白双面 | 0.5 元 | 两面共计 |
| 彩印单面 | 0.5 元 | - |
| 彩印双面 | 1.0 元 | 两面共计 |

配送费：送至房间加收 0.5～2 元（按楼层）

## 7. 订单状态定义

### 订餐订单状态
- 0: 待付款
- 1: 待接单
- 2: 备餐中
- 3: 配送中
- 4: 已完成
- 5: 已取消

### 打印任务状态
- 0: 待付款
- 1: 待打印
- 2: 打印中
- 3: 已完成

### 零食订单状态
- 0: 待付款
- 1: 待取货
- 2: 已完成
- 3: 已取消

## 8. 安全与隐私

- 手机号仅显示尾号，不完整展示
- 用户数据加密存储
- 文件上传限制类型和大小
- API 接口需要 JWT 认证

## 9. 开发计划

### 第一阶段：项目搭建
- 初始化前端小程序项目
- 初始化后端 Node.js 项目
- 创建数据库和表结构
- 实现用户登录功能

### 第二阶段：订餐模块
- 商家/菜品 CRUD
- 购物车功能
- 订单创建和管理
- 模拟支付

### 第三阶段：打印服务
- 文件上传功能
- 页数识别和费用计算
- 打印任务管理

### 第四阶段：零食小店
- 零食商品管理
- 零食订单流程
- 库存管理

### 第五阶段：联调测试
- 前后端联调
- 功能测试
- Bug 修复
